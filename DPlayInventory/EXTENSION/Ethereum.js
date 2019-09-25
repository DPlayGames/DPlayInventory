DPlayInventory.Ethereum = OBJECT({
	
	preset : () => {
		return Connector;
	},
	
	params : () => {
		return 'Ethereum';
	},
	
	init : (inner, self) => {
		
		let changeNetwork = self.changeNetwork = (networkName) => {
			//REQUIRED: networkName
			
			inner.send({
				methodName : 'changeNetwork',
				data : networkName
			});
		};
		
		// 이더리움 네트워크 이름을 가져옵니다.
		let getNetworkName = self.getNetworkName = (callback) => {
			//REQUIRED: callback
			
			inner.send({
				methodName : 'getNetworkName'
			}, callback);
		};
		
		// 스마트 계약 인터페이스를 생성합니다.
		let createSmartContractInterface = self.createSmartContractInterface = (params, callback) => {
			//REQUIRED: params
			//REQUIRED: params.abi
			//REQUIRED: params.address
			//OPTIONAL: params.onEvent
			//REQUIRED: callback
			
			inner.send({
				methodName : 'createSmartContractInterface',
				data : params
			}, callback);
		};
		
		// 스마트 계약의 메소드를 실행합니다.
		let runSmartContractMethod = self.runSmartContractMethod = (_params, callbackOrHandlers) => {
			//REQUIRED: params
			//REQUIRED: params.address
			//REQUIRED: params.methodName
			//REQUIRED: params.params
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			let errorHandler;
			let transactionHashCallback;
			let callback;
			
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				errorHandler = callbackOrHandlers.error;
				transactionHashCallback = callbackOrHandlers.transactionHash;
				callback = callbackOrHandlers.success;
			}
			
			inner.send({
				methodName : 'runSmartContractMethod',
				data : params
			}, (result) => {
				
				// 계약 실행 오류 발생
				if (result.errorMsg !== undefined) {
					if (errorHandler !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						SHOW_ERROR('Ethereum.runSmartContractMethod', result.errorMsg, params);
					}
				}
				
				// 정상 작동
				else if (callback !== undefined) {
					
					// output이 1개인 경우
					if (result.value !== undefined) {
						callback(result.value, result.str);
					}
					
					// output이 여러개인 경우
					else if (result.array !== undefined) {
						callback.apply(TO_DELETE, result.array);
					}
					
					// output이 없는 경우
					else {
						callback();
					}
				}
			});
		};
		
		let getEtherBalance = self.getEtherBalance = (callbackOrHandlers) => {
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			let callback;
			let errorHandler;
			
			// 콜백 정리
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				callback = callbackOrHandlers.success;
				errorHandler = callbackOrHandlers.error;
			}
			
			inner.send({
				methodName : 'getEtherBalance',
				data : params
			}, (result) => {
				
				// 계약 실행 오류 발생
				if (result.errorMsg !== undefined) {
					if (errorHandler !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						SHOW_ERROR('Ethereum.getEtherBalance', result.errorMsg, params);
					}
				}
				
				else {
					callback(result.balance);
				}
			});
		};
		
		let getDisplayPrice = self.getDisplayPrice = (actualPrice) => {
			return +(actualPrice / Math.pow(10, 18)).toFixed(11);
		};
		
		let getActualPrice = self.getActualPrice = (displayPrice) => {
			return displayPrice * Math.pow(10, 18);
		};
		
		let getERC20Balance = self.getERC20Balance = (addresses, callbackOrHandlers) => {
			//REQUIRED: addresses
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			let callback;
			let errorHandler;
			
			// 콜백 정리
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				callback = callbackOrHandlers.success;
				errorHandler = callbackOrHandlers.error;
			}
			
			inner.send({
				methodName : 'getERC20Balance',
				data : addresses
			}, (result) => {
				
				// 계약 실행 오류 발생
				if (result.errorMsg !== undefined) {
					if (errorHandler !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						SHOW_ERROR('Ethereum.getERC20Balance', result.errorMsg, addresses);
					}
				}
				
				else {
					callback(result.balance, result.address);
				}
			});
		};
		
		let getERC721Ids = self.getERC721Ids = (params, callbackOrHandlers) => {
			//REQUIRED: params
			//REQUIRED: params.addresses
			//REQUIRED: params.getItemIdsName
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			let callback;
			let errorHandler;
			
			// 콜백 정리
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				callback = callbackOrHandlers.success;
				errorHandler = callbackOrHandlers.error;
			}
			
			inner.send({
				methodName : 'getERC20Balance',
				data : params
			}, (result) => {
				
				// 계약 실행 오류 발생
				if (result.errorMsg !== undefined) {
					if (errorHandler !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						SHOW_ERROR('Ethereum.getERC721Ids', result.errorMsg, params);
					}
				}
				
				else {
					callback(result.ids, result.address);
				}
			});
		};
	}
});