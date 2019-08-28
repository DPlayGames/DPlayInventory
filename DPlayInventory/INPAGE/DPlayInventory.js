window.DPlayInventory = () => {
	let self = Connector();
	
	let methodMap = {};
	let sendKey = 0;
	
	let on = (methodName, method) => {
		
		let realMethodName = 'DPlayInventory/' + methodName;
	
		let methods = methodMap[realMethodName];
	
		if (methods === undefined) {
			methods = methodMap[realMethodName] = [];
		}
	
		methods.push(method);
	};
	
	let off = (methodName, method) => {
		
		let realMethodName = 'DPlayInventory/' + methodName;
		
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
	
	let send = (methodName, data, callback) => {
		
		let realMethodName = 'DPlayInventory/' + methodName;
		
		let callbackName;
		
		window.postMessage({
			methodName : realMethodName,
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
	
	// 보관함에 로그인합니다.
	let login = self.login = () => {
		send('login');
	};
	
	// 계정의 ID를 가져옵니다.
	let getAccountId = self.getAccountId = () => {
		
	};
	
	// 스마트 계약을 배포합니다.
	let deploySmartContract = self.deploySmartContract = () => {
		
	};
	
	// 스마트 계약 인터페이스를 생성합니다.
	let createSmartContractInterface = self.createSmartContractInterface = (params, callback) => {
		//REQUIRED: params
		//REQUIRED: params.abi
		//REQUIRED: params.address
		
		send('createSmartContractInterface', params, callback);
	};
	
	// 스마트 계약의 메소드를 실행합니다.
	let runSmartContractMethod = self.runSmartContractMethod = () => {
		
	};
	
	return self;
};