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
				
				browser.runtime.sendMessage({
					methodName : pack + '/' + methodName,
					data : data
				}, (result) => {
					
					if (result === TO_DELETE) {
						result = undefined;
					}
					
					if (result !== undefined && callback !== undefined) {
						callback(result.returnData);
					}
				});
			};
			
			browser.runtime.onMessage.addListener((params, sender, ret) => {
				
				let methodName = params.methodName;
				let data = params.data;
				
				let methods = methodMap[methodName];
		
				if (methods !== undefined) {
					methods.forEach((method) => {
						method(data, (returnData) => {
							ret({
								returnData : returnData
							});
						});
					});
				}
				
				return true;
			});
		}
	};
});