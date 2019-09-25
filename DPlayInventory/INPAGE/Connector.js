// Content Script와 연결되는 커넥터
window.Connector = (pack) => {
	//REQUIRED: pack
	
	let inner = {};
	
	let methodMap = {};
	let sendKey = 0;
	
	let on = inner.on = (methodName, method) => {
		
		let realMethodName = pack = '/' + methodName;
	
		let methods = methodMap[realMethodName];
	
		if (methods === undefined) {
			methods = methodMap[realMethodName] = [];
		}
	
		methods.push(method);
	};
	
	let off = inner.off = (methodName, method) => {
		
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
	
	let send = inner.send = (methodName, data, callback) => {
		
		let callbackName;
		
		window.postMessage({
			methodName : pack + '/' + methodName,
			data : data,
			sendKey : sendKey
		}, '*');
		
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
	
	window.addEventListener('message', (e) => {
		if (e.source === window) {
			
			let methodName = e.data.methodName;
			let data = e.data.data;
			let sendKey = e.data.sendKey;
			
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
		}
	}, false);
	
	return inner;
};