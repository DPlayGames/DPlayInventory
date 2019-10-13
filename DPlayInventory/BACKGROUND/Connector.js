// Content Script와 연결되는 커넥터
global.Connector = METHOD(() => {
	
	// 크롬에서는 browser 객체가 없습니다.
	if (window.browser === undefined) {
		window.browser = chrome;
	}
	
	return {
	
		run : (pack, listener) => {
			
			let ports = [];
			
			browser.runtime.onConnect.addListener((port) => {
				
				if (port.name === pack) {
					port.id = UUID();
					
					let methodMap = {};
					let sendKey = 0;
					
					let on = (methodName, method) => {
						//REQUIRED: methodName
						//REQUIRED: method
						
						let realMethodName = pack + '/' + methodName;
						
						let methods = methodMap[realMethodName];
						
						if (methods === undefined) {
							methods = methodMap[realMethodName] = [];
						}
						
						methods.push(method);
					};
					
					let off = (methodName, method) => {
						//REQUIRED: methodName
						//OPTIONAL: method
						
						let realMethodName = pack + '/' + methodName;
						
						let methods = methodMap[realMethodName];
				
						if (methods !== undefined) {
				
							if (method !== undefined) {
								
								let index = methods.indexOf(method);
								if (index !== -1) {
									methods.splice(index, 1);
								}
				
							} else {
								delete methodMap[realMethodName];
							}
						}
					};
					
					let send = (params, callback) => {
						//REQUIRED: params
						//REQUIRED: params.methodName
						//OPTIONAL: params.data
						//OPTIONAL: callback
						
						let methodName = params.methodName;
						let data = params.data;
						
						if (port !== undefined) {
							
							let callbackName;
							
							port.postMessage({
								methodName : pack + '/' + methodName,
								data : data,
								sendKey : sendKey,
								portId : port.id
							});
							
							if (callback !== undefined) {
								
								callbackName = '__CALLBACK_' + sendKey;
								
								// on callback.
								on(callbackName, (data) => {
									
									// run callback.
									callback(data);
									
									// off callback.
									off(callbackName);
								});
							}
							
							sendKey += 1;
						}
					};
					
					ports.push(port);
					
					port.onMessage.addListener((params) => {
						
						let methodName = params.methodName;
						let data = params.data;
						let sendKey = params.sendKey;
						
						let methods = methodMap[methodName];
						
						if (methods !== undefined) {
							methods.forEach((method) => {
								method(data, (retData) => {
									
									send({
										methodName : '__CALLBACK_' + sendKey,
										data : retData
									});
								});
							});
						}
					});
					
					port.onDisconnect.addListener(() => {
						REMOVE({
							array : ports,
							value : port
						});
						port = undefined;
					});
					
					listener(on, off, send);
				}
			});
		}
	};
});