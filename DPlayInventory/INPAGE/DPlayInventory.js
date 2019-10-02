window.DPlayInventory = (() => {
	
	let TO_DELETE = null;
	
	let SHOW_ERROR = (tag, errorMsg, params) => {
		//REQUIRED: tag
		//REQUIRED: errorMsg
		//OPTIONAL: params
		
		let cal = CALENDAR();
			
		console.error(cal.getYear() + '-' + cal.getMonth(true) + '-' + cal.getDate(true) + ' ' + cal.getHour(true) + ':' + cal.getMinute(true) + ':' + cal.getSecond(true) + ' [' + tag + '] 오류가 발생했습니다. 오류 메시지: ' + errorMsg);
		
		if (params !== undefined) {
			console.error('다음은 오류를 발생시킨 파라미터입니다.');
			console.error(JSON.stringify(params, TO_DELETE, 4));
		}
	};
	
	let CHECK_IS_DATA = (target) => {
		//OPTIONAL: target

		if (
		target !== undefined &&
		target !== TO_DELETE &&
		CHECK_IS_ARRAY(target) !== true &&
		target instanceof Date !== true &&
		target instanceof RegExp !== true &&
		typeof target === 'object') {
			return true;
		}

		return false;
	};
	
	let CHECK_IS_ARRAY = (target) => {
		//OPTIONAL: target

		if (
		target !== undefined &&
		target !== TO_DELETE &&
		typeof target === 'object' &&
		Object.prototype.toString.call(target) === '[object Array]') {
			return true;
		}

		return false;
	};
	
	let EACH = (dataOrArrayOrString, func) => {
		//OPTIONAL: dataOrArrayOrString
		//REQUIRED: func
		
		if (dataOrArrayOrString === undefined) {
			return false;
		}

		// when dataOrArrayOrString is data
		else if (CHECK_IS_DATA(dataOrArrayOrString) === true) {

			for (let name in dataOrArrayOrString) {
				if (dataOrArrayOrString.hasOwnProperty === undefined || dataOrArrayOrString.hasOwnProperty(name) === true) {
					if (func(dataOrArrayOrString[name], name) === false) {
						return false;
					}
				}
			}
		}

		// when dataOrArrayOrString is func
		else if (func === undefined) {

			func = dataOrArrayOrString;
			dataOrArrayOrString = undefined;

			return (dataOrArrayOrString) => {
				return EACH(dataOrArrayOrString, func);
			};
		}

		// when dataOrArrayOrString is array or string
		else {

			let length = dataOrArrayOrString.length;

			for (let i = 0; i < length; i += 1) {

				if (func(dataOrArrayOrString[i], i) === false) {
					return false;
				}

				// when shrink
				if (dataOrArrayOrString.length < length) {
					i -= length - dataOrArrayOrString.length;
					length -= length - dataOrArrayOrString.length;
				}

				// when stretch
				else if (dataOrArrayOrString.length > length) {
					length += dataOrArrayOrString.length - length;
				}
			}
		}

		return true;
	};
	
	let STRINGIFY = (data) => {
		//REQUIRED: data
		
		if (CHECK_IS_DATA(data) === true) {
			return JSON.stringify(PACK_DATA(data));
		}
		
		else if (CHECK_IS_ARRAY(data) === true) {
			
			let f = (array) => {
				
				let newArray = [];
				
				EACH(array, (data) => {
					if (CHECK_IS_DATA(data) === true) {
						newArray.push(PACK_DATA(data));
					} else if (CHECK_IS_ARRAY(data) === true) {
						newArray.push(f(data));
					} else {
						newArray.push(data);
					}
				});
				
				return newArray;
			};
			
			return JSON.stringify(f(data));
		}
		
		else {
			return JSON.stringify(data);
		}
	};
	
	let inner = Connector('DPlayInventory');
	let self = {};
	
	// 이더리움 네트워크 이름을 가져옵니다.
	let getNetworkName = self.getNetworkName = (callback) => {
		//REQUIRED: callback
		
		inner.send({
			methodName : 'getNetworkName'
		}, callback);
	};
	
	// 이더리움 네트워크를 변경합니다.
	let changeNetwork = self.changeNetwork = (networkName, callback) => {
		//REQUIRED: networkName
		//REQUIRED: callback
		
		inner.send({
			methodName : 'changeNetwork',
			data : networkName
		}, callback);
	};
	
	let login = self.login = (params, callback) => {
		//REQUIRED: params
		//REQUIRED: params.icon
		//REQUIRED: params.title
		//REQUIRED: callback
		
		inner.send({
			methodName : 'login',
			data : params
		}, callback);
	};
	
	// 계정의 ID를 가져옵니다.
	let getAccountId = self.getAccountId = (callback) => {
		//REQUIRED: callback
		
		inner.send({
			methodName : 'getAccountId'
		}, callback);
	};
	
	// 문자열에 서명합니다.
	let signText = self.signText = (text, callbackOrHandlers) => {
		//REQUIRED: text
		//REQUIRED: callbackOrHandlers
		//OPTIONAL: callbackOrHandlers.error
		//REQUIRED: callbackOrHandlers.success
		
		let errorHandler;
		let callback;
		
		if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
			callback = callbackOrHandlers;
		} else {
			errorHandler = callbackOrHandlers.error;
			callback = callbackOrHandlers.success;
		}
		
		inner.send({
			methodName : 'signText',
			data : text
		}, (result) => {
			
			// 오류 발생
			if (result.errorMsg !== undefined) {
				if (errorHandler === undefined) {
					SHOW_ERROR('DPlayInventory.signText', result.errorMsg, text);
				} else {
					errorHandler(result.errorMsg);
				}
			}
			
			else {
				callback(result.signature);
			}
		});
	};
	
	let signData = self.signData = (data, callbackOrHandlers) => {
		//REQUIRED: data
		//REQUIRED: callbackOrHandlers
		//OPTIONAL: callbackOrHandlers.error
		//REQUIRED: callbackOrHandlers.success
		
		let sortedData = {};
		Object.keys(data).sort().forEach((key) => {
			sortedData[key] = data[key];
		});
		
		signText(STRINGIFY(sortedData), callbackOrHandlers);
	};
	
	// 계정의 이더 잔고를 가져옵니다.
	let getEtherBalance = self.getEtherBalance = (callbackOrHandlers) => {
		//REQUIRED: callbackOrHandlers
		//OPTIONAL: callbackOrHandlers.error
		//REQUIRED: callbackOrHandlers.success
		
		let errorHandler;
		let callback;
		
		if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
			callback = callbackOrHandlers;
		} else {
			errorHandler = callbackOrHandlers.error;
			callback = callbackOrHandlers.success;
		}
		
		inner.send({
			methodName : 'getEtherBalance',
			data : text
		}, (result) => {
			
			// 오류 발생
			if (result.errorMsg !== undefined) {
				if (errorHandler === undefined) {
					SHOW_ERROR('DPlayInventory.getEtherBalance', result.errorMsg, text);
				} else {
					errorHandler(result.errorMsg);
				}
			}
			
			else {
				callback(result.balance);
			}
		});
	};
	
	// 스마트 계약을 배포합니다.
	let deploySmartContract = self.deploySmartContract = () => {
		//TODO:
	};
	
	// DPlay 보관함의 스킨을 변경합니다.
	let changeInventorySkin = self.changeInventorySkin = () => {
		//TODO:
	};
	
	let addChangeNetworkHandler = self.addChangeNetworkHandler = (changeNetworkHandler) => {
		//REQUIRED: changeNetworkHandler
		
		inner.on('networkChanged', () => {
			changeNetworkHandler();
		});
	};
	
	let addChangeAccountHandler = self.addChangeAccountHandler = (changeAccountHandler) => {
		//REQUIRED: changeAccountHandler
		
		inner.on('accountsChanged', (accountId) => {
			changeAccountHandler(accountId);
		});
	};
	
	let eventMap = {};
	
	// 스마트 계약 인터페이스를 생성합니다.
	let createSmartContractInterface = self.createSmartContractInterface = (params, callback) => {
		//REQUIRED: params
		//REQUIRED: params.abi
		//REQUIRED: params.address
		//OPTIONAL: params.onEvent
		//REQUIRED: callback
		
		let abi = params.abi;
		let address = params.address;
		let onEvent = params.onEvent;
		
		if (onEvent !== undefined) {
			if (eventMap[address] === undefined) {
				eventMap[address] = [];
			}
			eventMap[address].push(onEvent);
		}
		
		inner.send({
			methodName : 'createSmartContractInterface',
			data : {
				abi : abi,
				address : address
			}
		}, callback);
	};
	
	inner.on('__CONTRACT_EVENT', (params) => {
		
		let address = params.address;
		let eventName = params.eventName;
		let args = params.args;
		
		if (eventMap[address] !== undefined) {
			eventMap[address](eventName, args);
		}
	});
	
	// 트랜잭션이 완료될 때 까지 확인합니다.
	let watchTransaction = self.watchTransaction = (transactionHash, callbackOrHandlers) => {
		//REQUIRED: transactionHash
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
			methodName : 'watchTransaction',
			data : transactionHash
		}, (result) => {
			
			if (result.errorMsg !== undefined) {
				if (errorHandler === undefined) {
					SHOW_ERROR('DPlayInventory.watchTransaction', result.errorMsg, transactionHash);
				} else {
					errorHandler(result.errorMsg);
				}
			}
			
			else {
				callback();
			}
		});
	};
	
	// 스마트 계약의 메소드를 실행합니다.
	let runSmartContractMethod = self.runSmartContractMethod = (params, callbackOrHandlers) => {
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
			
			if (result.errorMsg !== undefined) {
				if (errorHandler === undefined) {
					SHOW_ERROR('DPlayInventory.runSmartContractMethod', result.errorMsg, params);
				} else {
					errorHandler(result.errorMsg);
				}
			}
			
			else if (result.value !== undefined) {
				callback(result.value, result.str);
			} else if (result.array !== undefined) {
				callback.apply(TO_DELETE, result.array);
			} else {
				callback();
			}
		});
	};
	
	return self;
})();