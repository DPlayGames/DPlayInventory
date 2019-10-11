// 크롬에서는 browser 객체가 없습니다.
if (window.browser === undefined) {
	window.browser = chrome;
}

// In Page Script 및 Background Script와 연결되는 커넥터
window.Connector = (pack) => {
	//REQUIRED: pack
	
	let inner = {};
	
	let methodMap = {};
	let sendKey = 0;
	
	let runMethods = (methodName, data, send, sendKey) => {

		let methods = methodMap[methodName];

		if (methods !== undefined) {

			methods.forEach((method) => {

				// run method.
				method(data,

				// ret.
				(retData) => {

					// send to background
					if (sendKey === undefined) {
						send(retData);
					}
					
					// send to page
					else {
						send({
							methodName : '__CALLBACK_' + sendKey,
							data : retData
						});
					}
				});
			});
		}
	};
	
	let on = inner.on = (methodName, method) => {
		
		let realMethodName = pack + '/' + methodName;

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
	
	let sendToBackground = inner.sendToBackground = (params, callback) => {
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
	
	let sendToPage = inner.sendToPage = (params, callback) => {
		//REQUIRED: params
		//REQUIRED: params.methodName
		//OPTIONAL: params.data
		//OPTIONAL: callback
		
		let methodName = params.methodName;
		let data = params.data;
		
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
	
	browser.runtime.onMessage.addListener((params, sender, ret) => {
		
		let methodName = params.methodName;
		let data = params.data;
		
		runMethods(methodName, data, (returnData) => {
			ret({
				returnData : returnData
			});
		});
		
		return true;
	});
	
	window.addEventListener('message', (e) => {
		if (e.source === window) {
			
			let methodName = e.data.methodName;
			let data = e.data.data;
			let sendKey = e.data.sendKey;
			
			runMethods(methodName, data, sendToPage, sendKey);
		}
	}, false);
	
	return inner;
};