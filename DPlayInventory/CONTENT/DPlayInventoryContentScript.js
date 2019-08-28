RUN(() => {
	
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
	
	// 보관함에 로그인합니다.
	on('login', (params, callback) => {
		//REQUIRED: params
		//REQUIRED: params.icon
		//REQUIRED: params.title
		
		// 로그인 창을 엽니다.
		window.open(chrome.runtime.getURL('popup/login.html'), 'extension_popup', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=300,height=300');
	});
	
	// 계정의 ID를 가져옵니다.
	on('getAccountId', (notUsing, callback) => {
		
	});
	
	// 스마트 계약 인터페이스를 생성합니다.
	on('createContractInterface', (params, callback) => {
		//REQUIRED: params
		//REQUIRED: params.abi
		//REQUIRED: params.bytecode
		
	});
	
	// 스마트 계약의 메소드를 실행합니다.
	on('runContractMethod', (params, callback) => {
		//REQUIRED: params
		
	});
});