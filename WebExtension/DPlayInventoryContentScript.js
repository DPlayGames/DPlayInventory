(() => {
	
	// 보관함 실행중...
	var script = document.createElement('script');
	script.textContent = 'window.isDPlayInventoryRunning = true;';
	document.documentElement.appendChild(script);
	
	let methodMap = {};
	let sendKey = 0;
	
	let runMethods = (methodName, data, send, sendKey) => {

		let methods = methodMap[methodName];

		if (methods !== undefined) {

			methods.forEech((method) => {

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
	
	let on = (methodName, method) => {

		let methods = methodMap[methodName];

		if (methods === undefined) {
			methods = methodMap[methodName] = [];
		}

		methods.push(method);
	};
	
	let off = (methodName, method) => {
		
		let methods = methodMap[methodName];

		if (methods !== undefined) {

			if (method !== undefined) {
				
				let index = methods.indexOf(method);
				if (index !== -1) {
					methods.splice(index, 1);
				}

			} else {
				delete methodMap[methodName];
			}
		}
	};
	
	let sendToBackground = (backgroundName, methodName, data, callback) => {
		
		chrome.runtime.sendMessage({
			methodName : backgroundName + '/' + methodName,
			data : data
		}, callback);
	};
	
	let sendToPage = (methodName, data, callback) => {
		
		let callbackName;
		
		window.postMessage({
			methodName : methodName,
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
	
	chrome.runtime.onMessage.addListener((params, sender, ret) => {
		
		let methodName = params.methodName;
		let data = params.data;
		
		runMethods(methodName, data, ret);
	});
	
	window.addEventListener('message', (e) => {
		if (e.source === window) {
			
			let methodName = e.data.methodName;
			let data = e.data.data;
			let sendKey = e.data.sendKey;
			
			runMethods(methodName, data, sendToPage, sendKey);
		}
	}, false);
	
	//TODO:
	
	// 인페이지 스크립트 추가
	let inPageScript = document.createElement('script');
	inPageScript.src = chrome.runtime.getURL('DPlayInventoryInPage.js');
	document.documentElement.appendChild(inPageScript);
})();