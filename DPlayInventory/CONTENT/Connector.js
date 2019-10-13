// 크롬에서는 browser 객체가 없습니다.
if (window.browser === undefined) {
	window.browser = chrome;
}

// In Page Script 및 Background Script와 연결되는 커넥터
window.Connector = (pack) => {
	//REQUIRED: pack
	
	let inner = {};
	
	let pageMethodMap = {};
	let backgroundMethodMap = {};
	
	let sendKey = 0;
	
	let port = browser.runtime.connect({
		name : pack
	});
	
	let onFromPage = inner.onFromPage = (methodName, method) => {
		
		let realMethodName = pack + '/' + methodName;

		let methods = pageMethodMap[realMethodName];

		if (methods === undefined) {
			methods = pageMethodMap[realMethodName] = [];
		}

		methods.push(method);
	};
	
	let offFromPage = inner.offFromPage = (methodName, method) => {
		
		let realMethodName = pack + '/' + methodName;
		
		let methods = pageMethodMap[realMethodName];

		if (methods !== undefined) {

			if (method !== undefined) {
				
				let index = methods.indexOf(method);
				if (index !== -1) {
					methods.splice(index, 1);
				}

			} else {
				delete pageMethodMap[realMethodName];
			}
		}
	};
	
	let onFromBackground = inner.onFromBackground = (methodName, method) => {
		
		let realMethodName = pack + '/' + methodName;

		let methods = backgroundMethodMap[realMethodName];

		if (methods === undefined) {
			methods = backgroundMethodMap[realMethodName] = [];
		}

		methods.push(method);
	};
	
	let offFromBackground= inner.offFromBackground = (methodName, method) => {
		
		let realMethodName = pack + '/' + methodName;
		
		let methods = backgroundMethodMap[realMethodName];

		if (methods !== undefined) {

			if (method !== undefined) {
				
				let index = methods.indexOf(method);
				if (index !== -1) {
					methods.splice(index, 1);
				}

			} else {
				delete backgroundMethodMap[realMethodName];
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
		
		let callbackName;
		
		port.postMessage({
			methodName : pack + '/' + methodName,
			data : data,
			sendKey : sendKey
		});
		
		if (callback !== undefined) {
			
			callbackName = '__CALLBACK_' + sendKey;

			// on callback.
			onFromBackground(callbackName, (data) => {
				
				// run callback.
				callback(data);

				// off callback.
				offFromBackground(callbackName);
			});
		}

		sendKey += 1;
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
			onFromPage(callbackName, (data) => {

				// run callback.
				callback(data);

				// off callback.
				offFromPage(callbackName);
			});
		}

		sendKey += 1;
	};
	
	port.onMessage.addListener((params) => {
		
		let methodName = params.methodName;
		let data = params.data;
		let sendKey = params.sendKey;
		
		let methods = backgroundMethodMap[methodName];
		
		if (methods !== undefined) {
			methods.forEach((method) => {
				method(data, (retData) => {
					
					sendToBackground({
						methodName : '__CALLBACK_' + sendKey,
						data : retData
					});
				});
			});
		}
	});
	
	window.addEventListener('message', (e) => {
		if (e.source === window) {
			
			let methodName = e.data.methodName;
			let data = e.data.data;
			let sendKey = e.data.sendKey;
			
			let methods = pageMethodMap[methodName];
			
			if (methods !== undefined) {
				methods.forEach((method) => {
					method(data, (retData) => {
						
						sendToPage({
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