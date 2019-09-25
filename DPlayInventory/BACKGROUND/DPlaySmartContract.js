global.DPlaySmartContract = CLASS({
	
	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.abi
		//REQUIRED: params.addresses
		
		let abi = params.abi;
		let addresses = params.addresses;
		
		let address;
		
		let waitingRunSmartContractMethodInfos = [];
		let innerRunSmartContractMethod;
		
		let eventMap = {};
		
		// 스마트 계약의 메소드를 실행합니다.
		let runSmartContractMethod = (methodName, params, callbackOrHandlers) => {
			
			if (innerRunSmartContractMethod === undefined) {
				
				waitingRunSmartContractMethodInfos.push({
					methodName : methodName,
					params : params,
					callbackOrHandlers : callbackOrHandlers
				});
				
			} else {
				
				getAddress((address) => {
					
					innerRunSmartContractMethod({
						address : address,
						methodName : methodName,
						params : params
					}, callbackOrHandlers);
				});
			}
		};
		
		let getAddress = self.getAddress = (callback) => {
			//REQUIRED: callback
			
			if (address === undefined) {
				DPlayInventory.getNetworkName((networkName) => {
					address = addresses[networkName];
					callback(address);
				});
			}
			
			else {
				callback(address);
			}
		};
		
		getAddress((address) => {
			
			// 스마트 계약 인터페이스 생성
			DPlayInventory.createSmartContractInterface({
				abi : abi,
				address : address,
				onEvent : (eventName, args) => {
					
					let eventHandlers = eventMap[eventName];
					
					if (eventHandlers !== undefined) {
						EACH(eventHandlers, (eventHandler) => {
							eventHandler(args);
						});
					}
				}
			}, () => {
				
				innerRunSmartContractMethod = DPlayInventory.runSmartContractMethod;
				
				// 대기중인 내용 실행
				EACH(waitingRunSmartContractMethodInfos, (info) => {
					
					innerRunSmartContractMethod({
						address : address,
						methodName : info.methodName,
						params : info.params
					}, info.callback);
				});
			});
		});
		
		// 메소드 분석 및 생성
		EACH(abi, (methodInfo) => {
			if (methodInfo.type === 'function') {
				
				self[methodInfo.name] = (params, callbackOrHandlers) => {
					
					// 콜백만 입력된 경우
					if (callbackOrHandlers === undefined && typeof params === 'function') {
						callbackOrHandlers = params;
						params = undefined;
					}
					
					runSmartContractMethod(methodInfo.name, params, callbackOrHandlers);
				};
			}
		});
		
		// 이벤트 핸들러를 등록합니다.
		let on = self.on = (eventName, eventHandler) => {
			//REQUIRED: eventName
			//REQUIRED: eventHandler
			
			if (eventMap[eventName] === undefined) {
				eventMap[eventName] = [];
			}

			eventMap[eventName].push(eventHandler);
		};
		
		// 이벤트 핸들러를 제거합니다.
		let off = self.off = (eventName, eventHandler) => {
			//REQUIRED: eventName
			//OPTIONAL: eventHandler

			if (eventMap[eventName] !== undefined) {

				if (eventHandler !== undefined) {

					REMOVE({
						array: eventMap[eventName],
						value: eventHandler
					});
				}

				if (eventHandler === undefined || eventMap[eventName].length === 0) {
					delete eventMap[eventName];
				}
			}
		};
	}
});