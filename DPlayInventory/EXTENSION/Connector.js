// Background Script와 연결되는 커넥터
global.Connector = CLASS(() => {
	
	// 크롬에서는 browser 객체가 없습니다.
	if (window.browser === undefined) {
		window.browser = chrome;
	}
	
	return {
	
		init : (inner, self, params) => {
			//REQUIRED: params
			//REQUIRED: params.pack
			
			let pack = params.pack;
			
			let methodMap = {};
			let sendKey = 0;
			
			let port = browser.runtime.connect({
				name : pack
			});
			
			let on = inner.on = (methodName, method) => {
				//REQUIRED: methodName
				//REQUIRED: method
				
				let realMethodName = pack + '/' + methodName;
				
				let methods = methodMap[realMethodName];
		
				if (methods === undefined) {
					methods = methodMap[realMethodName] = [];
				}
				
				methods.push(method);
			};
			
			let off = inner.off = (methodName, method) => {
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
			
			let send = inner.send = (params, callback) => {
				//REQUIRED: params
				//REQUIRED: params.methodName
				//OPTIONAL: params.data
				//OPTIONAL: callback
				
				let methodName = params.methodName;
				let data = params.data;
				
				let callbackName;
				
				port.postMessage({
					methodName : pack + '/' + methodName,
					data : data,
					sendKey : sendKey
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
			};
			
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
		}
	};
});