global.DPlayInventory = OBJECT({
	
	init : (inner, self) => {
		
		// 가져오는 속도는 HTTP가 Web Socket보다 빠릅니다.
		const NETWORK_ADDRESSES = {
			Mainnet : 'https://mainnet.infura.io/v3/c1a2b959458440c780e5614fd075051b',
			Kovan : 'https://kovan.infura.io/v3/c1a2b959458440c780e5614fd075051b',
			Ropsten : 'https://ropsten.infura.io/v3/c1a2b959458440c780e5614fd075051b',
			Rinkeby : 'https://rinkeby.infura.io/v3/c1a2b959458440c780e5614fd075051b'
		};
		
		// 이벤트는 Web Socket으로만 받아올 수 있습니다.
		const NETWORK_WS_ADDRESSES = {
			Mainnet : 'wss://mainnet.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
			Kovan : 'wss://kovan.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
			Ropsten : 'wss://ropsten.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
			Rinkeby : 'wss://rinkeby.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b'
		};
		
		let networkStore = STORE('__NETWORK_STORE');
		
		let networkName = networkStore.get('networkName') !== undefined ? networkStore.get('networkName') : 'Mainnet';
		
		let getNetworkName = self.getNetworkName = () => {
			return networkName;
		};
		
		let web3;
		let web3WS;
		
		let getProvider = () => {
			return new Web3.providers.HttpProvider(NETWORK_ADDRESSES[networkName]);
		};
		
		let getWebSocketProvider = () => {
			
			let provider = new Web3.providers.WebsocketProvider(NETWORK_WS_ADDRESSES[networkName]);
			provider.on('end', (e) => {
				SHOW_ERROR('SmartContract', 'WebsocketProvider의 접속이 끊어졌습니다. 재접속합니다.');
				weweb3WSb3.setProvider(getProvider());
			});
			
			return provider;
		};
		
		let changeNetwork = (_networkName, callback) => {
			
			networkName = _networkName;
			
			networkStore.save({
				name : 'networkName',
				value : networkName
			});
			
			web3 = new Web3(getProvider(NETWORK_ADDRESSES[networkName]));
			web3WS = new Web3(getWebSocketProvider(NETWORK_WS_ADDRESSES[networkName]));
			
			DPlaySmartContract.initAll(callback);
		}
		
		changeNetwork(networkName);
		
		let popupId;
		
		browser.windows.onRemoved.addListener((_popupId) => {
			if (popupId === _popupId) {
				popupId = undefined;
			}
		});
		
		let openPopup = (params) => {
			
			if (popupId !== undefined) {
				browser.windows.remove(popupId);
			}
			
			params.type = 'popup';
			params.left = 20;
			params.top = 20;
			
			params.width += 16;
			params.height += 35;
			
			browser.windows.create(params, (win) => {
				popupId = win.id;
			});
		};
		
		let openCartoonPopup = (params) => {
			
			params.type = 'popup';
			
			params.width += 16;
			params.height += 35;
			
			params.left = INTEGER((screen.width - params.width) / 2);
			params.top = INTEGER((screen.height - params.height) / 2);
			
			browser.windows.create(params);
		};
		
		let contracts = {};
		let contractsWS = {};
		
		let methodMap = {};
		let eventMap = {};
		
		let eventPorts = [];
		browser.runtime.onConnect.addListener((eventPort) => {
			
			if (eventPort.name === '__CONTRACT_EVENT') {
				eventPorts.push(eventPort);
				eventPort.onDisconnect.addListener(() => {
					REMOVE({
						array : eventPorts,
						value : eventPort
					});
				});
			}
		});
		
		let changeNetworkName;
		let changeNetworkCallback;
		
		let loginParams;
		let loginCallback;
		
		let runSmartContractMethodInfo;
		let runSmartContractMethodCallback;
		
		let password;
		
		let createSmartContractInterface = self.createSmartContractInterface = (params, callback) => {
			
			let abi = params.abi;
			let address = params.address;
			
			contracts[address] = new web3.eth.Contract(abi, address);
			
			let contractWS = contractsWS[address] = new web3WS.eth.Contract(abi, address);
			
			// 계약의 이벤트 핸들링
			contractWS.events.allEvents((error, info) => {
				
				if (error === TO_DELETE) {
					
					let args = info.returnValues;
					
					EACH(info.args, (value, name) => {
						
						let type;
						
						EACH(eventMap[address][info.event].inputs, (input) => {
							if (input.name === name) {
								type = input.type;
							}
						});
						
						// 숫자인 경우
						if (value.toNumber !== undefined) {
							args[name] = value.toNumber();
						}
						
						// 주소인 경우
						else if (type === 'address') {
							args[name] = web3.utils.toChecksumAddress(value);
						}
					});
					
					EACH(eventPorts, (eventPort) => {
						eventPort.postMessage({
							address : address,
							eventName : info.event,
							args : args
						});
					});
				}
			});
			
			let methods = methodMap[address] = {};
			let events = eventMap[address] = {};
			
			// 메소드 분석 및 생성
			EACH(abi, (methodInfo) => {
				if (methodInfo.type === 'event') {
					events[methodInfo.name] = methodInfo;
				} else if (methodInfo.type === 'function') {
					methods[methodInfo.name] = methodInfo;
				}
			});
			
			callback();
		};
		
		let cleanArg = (type, arg) => {
			
			// 배열인 경우
			if (type.substring(type.length - 2) === '[]') {
				
				let array = [];
				EACH(arg, (value, i) => {
					
					// 숫자인 경우
					if (type.indexOf('int') !== -1) {
						array.push(String(value));
					}
					
					// 주소인 경우
					else if (type.substring(0, type.length - 2) === 'address') {
						array.push(web3.utils.toChecksumAddress(value));
					}
					
					// 기타
					else {
						array.push(value);
					}
				});
				
				return array;
			}
			
			// 숫자인 경우
			else if (type.indexOf('int') !== -1) {
				return String(arg);
			}
			
			// 주소인 경우
			else if (type === 'address') {
				return web3.utils.toChecksumAddress(arg);
			}
			
			// 기타
			else {
				return arg;
			}
		};
		
		let cleanArgs = (methodInfo, params) => {
			
			let args = [];
			
			// 파라미터가 파라미터가 없거나 1개인 경우
			if (methodInfo.payable !== true && methodInfo.inputs.length <= 1) {
				if (methodInfo.inputs.length !== 0) {
					args.push(cleanArg(methodInfo.inputs[0].type, params));
				}
			}
			
			// 파라미터가 여러개인 경우
			else {
				
				let paramsArray = [];
				EACH(params, (param) => {
					paramsArray.push(param);
				});
				
				EACH(methodInfo.inputs, (input, i) => {
					if (input.name !== '') {
						args.push(cleanArg(input.type, params[input.name]));
					} else {
						args.push(cleanArg(input.type, paramsArray[i]));
					}
				});
			}
			
			return args;
		};
		
		// 결과를 정돈합니다.
		let cleanResult = (outputs, result) => {
			
			// output이 없는 경우
			if (outputs.length === 0) {
				return undefined;
			}
			
			// output이 1개인 경우
			else if (outputs.length === 1) {
				
				let type = outputs[0].type;
				
				// 배열인 경우
				if (type.substring(type.length - 2) === '[]') {
					
					let array = [];
					let strArray = [];
					EACH(result, (value, i) => {
						
						// 숫자인 경우
						if (type.indexOf('int') !== -1) {
							array.push(INTEGER(value));
							strArray.push(value);
						}
						
						// 주소인 경우
						else if (type.substring(0, type.length - 2) === 'address') {
							array.push(web3.utils.toChecksumAddress(value));
							strArray.push(value);
						}
						
						// 기타
						else {
							array.push(value);
							strArray.push(value);
						}
					});
					
					return {
						value : array,
						str : strArray
					};
				}
				
				// 숫자인 경우
				else if (type.indexOf('int') !== -1) {
					return {
						value : INTEGER(result),
						str : result
					};
				}
				
				// 주소인 경우
				else if (type === 'address') {
					return {
						value : web3.utils.toChecksumAddress(result),
						str : result
					};
				}
				
				// 기타
				else {
					return {
						value : result,
						str : result
					};
				}
			}
			
			// output이 여러개인 경우
			else if (outputs.length > 1) {
				
				let resultArray = [];
				
				EACH(outputs, (output, i) => {
					
					let type = output.type;
					
					// 배열인 경우
					if (type.substring(type.length - 2) === '[]') {
						
						let array = [];
						EACH(result[i], (value, j) => {
							
							// 숫자인 경우
							if (type.indexOf('int') !== -1) {
								array.push(INTEGER(value));
							}
							
							// 주소인 경우
							else if (type.substring(0, type.length - 2) === 'address') {
								array.push(web3.utils.toChecksumAddress(value));
							}
							
							// 기타
							else {
								array.push(value);
							}
						});
						
						resultArray.push(array);
					}
					
					// 숫자인 경우
					else if (type.indexOf('int') !== -1) {
						resultArray.push(INTEGER(result[i]));
					}
					
					// 주소인 경우
					else if (type === 'address') {
						resultArray.push(web3.utils.toChecksumAddress(result[i]));
					}
					
					// 기타
					else {
						resultArray.push(result[i]);
					}
				});
				
				EACH(outputs, (output, i) => {
					
					let type = output.type;
					
					// 배열인 경우
					if (type.substring(type.length - 2) === '[]') {
						
						let strArray = [];
						EACH(result[i], (value, j) => {
							
							// 숫자인 경우
							if (type.indexOf('int') !== -1) {
								strArray.push(value);
							}
							
							// 기타
							else {
								strArray.push(value);
							}
						});
						
						resultArray.push(strArray);
					}
					
					// 숫자인 경우
					else if (type.indexOf('int') !== -1) {
						resultArray.push(result[i]);
					}
					
					// 주소인 경우
					else if (type === 'address') {
						resultArray.push(web3.utils.toChecksumAddress(result[i]));
					}
					
					// 기타
					else {
						resultArray.push(result[i]);
					}
				});
				
				return {
					array : resultArray
				};
			}
		};
		
		let runSmartContractMethod = self.runSmartContractMethod = (_params, callback) => {
			
			let address = _params.address;
			let methodName = _params.methodName;
			let params = _params.params;
			
			let contract = contracts[address];
			let methods = methodMap[address];
			
			if (contract !== undefined && methods !== undefined && methods[methodName] !== undefined) {
				
				let methodInfo = methods[methodName];
				
				let args = cleanArgs(methodInfo, params);
				
				// constant 함수인 경우
				if (methodInfo.constant === true) {
					
					// 함수 실행
					contract.methods[methodInfo.name].apply(contract.methods, args).call((error, result) => {
						
						// 계약 실행 오류 발생
						if (error !== TO_DELETE) {
							callback({
								errorMsg : error.toString()
							});
						}
						
						// 정상 작동
						else {
							
							// output이 없는 경우
							if (methodInfo.outputs.length === 0) {
								callback({});
							}
							
							// output이 1개인 경우
							else if (methodInfo.outputs.length === 1) {
								result = cleanResult(methodInfo.outputs, result);
								callback(result);
							}
							
							// output이 여러개인 경우
							else if (methodInfo.outputs.length > 1) {
								result = cleanResult(methodInfo.outputs, result);
								callback(result);
							}
						}
					});
				}
				
				// 트랜잭션이 필요한 함수인 경우
				else {
					
					getAccountId((accountId) => {
						
						if (accountId !== undefined) {
							
							web3.eth.getTransactionCount(accountId, 'pending', (error, nonce) => {
								
								if (error !== TO_DELETE) {
									callback({
										errorMsg : error.toString()
									});
								}
								
								else {
									
									let method = contract.methods[methodInfo.name].apply(contract.methods, args);
									
									method.estimateGas({
										from : accountId
									}, (error, gas) => {
										
										if (error !== TO_DELETE) {
											callback({
												errorMsg : error.toString()
											});
										}
										
										else {
											
											GET('https://ethgasstation.info/json/ethgasAPI.json', {
												
												error : (errorMsg) => {
													callback({
														errorMsg : errorMsg
													});
												},
												
												success : (gasPrices) => {
													gasPrices = PARSE_STR(gasPrices);
													
													runSmartContractMethodInfo = {
														title : _params.title,
														favicon : _params.favicon,
														address : address,
														methodName : methodName,
														params : params,
														nonce : nonce,
														gasPriceAverage : gasPrices.average / 10,
														gasPriceFast : gasPrices.fast / 10,
														gas : gas
													};
													
													runSmartContractMethodCallback = callback;
													
													openPopup({
														url : 'runmethod.html',
														width : 374,
														height : 554
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			}
		};
		
		let getAccountId = self.getAccountId = (callback) => {
			
			browser.storage.local.get(['accountId'], (result) => {
				
				if (result.accountId === undefined) {
					callback(undefined);
				}
				
				else {
					
					Crypto.decrypt({
						encryptedText : result.accountId,
						password : password
					}, {
						error : () => {
							callback(undefined);
						},
						success : callback
					});
				}
			});
		};
		
		let getPrivateKey = (callbackOrHandlers) => {
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
			
			browser.storage.local.get(['privateKey'], (result) => {
				
				Crypto.decrypt({
					encryptedText : result.privateKey,
					password : password
				}, {
					error : errorHandler,
					success : callback
				});
			});
		};
		
		let signText = self.signText = (text, callback) => {
			//REQUIRED: text
			//REQUIRED: callback
			
			getPrivateKey((privateKey) => {
				
				let i, length, c;
				for(length = i = 0; c = text.charCodeAt(i++); length += c >> 11 ? 3 : c >> 7 ? 2 : 1);
				
				let prefixedMessage = ethereumjs.Util.sha3('\x19Ethereum Signed Message:\n' + length + text);
				let signedMessage = ethereumjs.Util.ecsign(prefixedMessage, ethereumjs.Util.toBuffer('0x' + privateKey));
				
				callback(ethereumjs.Util.toRpcSig(signedMessage.v, signedMessage.r, signedMessage.s).toString('hex'));
			});
		};
		
		let signData = self.signData = (data, callback) => {
			//REQUIRED: data
			//REQUIRED: callback
			
			let sortedData = {};
			Object.keys(data).sort().forEach((key) => {
				sortedData[key] = data[key];
			});
			
			signText(STRINGIFY(sortedData), callback);
		};
		
		Connector('DPlayInventory', (on, off, send) => {
			
			// 네트워크를 변경합니다.
			on('changeNetwork', (networkName, callback) => {
				
				changeNetworkName = networkName;
				changeNetworkCallback = callback;
				
				openPopup({
					url : 'changenetwork.html',
					width : 340,
					height : 240
				});
			});
			
			// 네트워크 변경 콜백을 실행합니다.
			on('changeNetworkCallback', () => {
				changeNetwork(changeNetworkName, changeNetworkCallback);
			});
			
			on('getChangeNetworkName', (notUsing, callback) => {
				callback(changeNetworkName);
			});
			
			// 이더리움 네트워크 이름을 가져옵니다.
			on('getNetworkName', (notUsing, callback) => {
				callback(networkName);
			});
			
			// 로그인 창을 엽니다.
			on('login', (params, callback) => {
				
				loginParams = params;
				loginCallback = callback;
				
				browser.storage.local.get(['accountId'], (result) => {
					
					// 계정이 존재하지 않으면
					if (result.accountId === undefined) {
						
						openPopup({
							url : 'restoreaccount.html',
							width : 374,
							height : 554
						});
					}
					
					// 로그인 화면
					else {
						
						openPopup({
							url : 'login.html',
							width : 340,
							height : 240
						});
					}
				});
			});
			
			// 로그인 콜백을 실행합니다.
			on('loginCallback', () => {
				
				if (loginParams !== undefined && loginParams.url !== undefined) {
					
					browser.storage.local.get(['integrated-' + loginParams.url], (result) => {
						
						// 연동 화면
						if (result['integrated-' + loginParams.url] !== true) {
							
							openPopup({
								url : 'integrate.html',
								width : 340,
								height : 240
							});
						}
						
						else {
							loginCallback(true);
							loginCallback = undefined;
						}
					});
				}
			});
			
			on('getLoginParams', (notUsing, callback) => {
				callback(loginParams);
			});
			
			// 서비스와 연동합니다.
			on('integrate', (notUsing) => {
				
				if (loginParams !== undefined && loginParams.url !== undefined) {
					
					let data = {};
					data['integrated-' + loginParams.url] = true;
					
					browser.storage.local.set(data, () => {
						loginCallback(true);
						loginCallback = undefined;
					});
				}
			});
			
			// 스마트 계약 인터페이스를 생성합니다.
			on('createSmartContractInterface', createSmartContractInterface);
			
			// 트랜잭션이 완료될 때 까지 확인합니다.
			on('watchTransaction', (transactionHash, callback) => {
				//REQUIRED: transactionHash
				//REQUIRED: callback
				
				let retry = RAR(() => {
					
					web3.eth.getTransactionReceipt(transactionHash, (error, result) => {
						
						// 트랜잭선 오류 발생
						if (error !== TO_DELETE) {
							callback({
								errorMsg : error.toString()
							});
						}
						
						// 아무런 값이 없으면 재시도
						else if (result === TO_DELETE || result.blockHash === TO_DELETE) {
							retry();
						}
						
						// 트랜잭선 오류 발생
						else if (result.status === '0x0') {
							callback({
								errorMsg : 'Transaction Error'
							});
						}
						
						// 트랜잭션 완료
						else {
							callback({});
						}
					});
				});
			});
			
			// 스마트 계약의 메소드를 실행합니다.
			on('runSmartContractMethod', runSmartContractMethod);
			
			on('getRunSmartContractMethodInfo', (notUsing, callback) => {
				callback(runSmartContractMethodInfo);
			});
			
			on('runSmartContractMethodCallback', (gasPrice) => {
				
				let address = runSmartContractMethodInfo.address;
				let methodName = runSmartContractMethodInfo.methodName;
				let params = runSmartContractMethodInfo.params;
				
				let contract = contracts[address];
				let methods = methodMap[address];
				
				if (contract !== undefined && methods !== undefined && methods[methodName] !== undefined) {
					
					let methodInfo = methods[methodName];
					
					let args = cleanArgs(methodInfo, params);
					
					// 파라미터가 파라미터가 없거나 1개인 경우
					if (methodInfo.payable !== true && methodInfo.inputs.length <= 1) {
						// ignore.
					}
					
					// 파라미터가 여러개인 경우
					else {
						// ignore.
					}
					
					// constant 함수인 경우
					if (methodInfo.constant === true) {
						// ignore.
					}
					
					// 트랜잭션이 필요한 함수인 경우
					else {
						
						let method = contract.methods[methodInfo.name].apply(contract.methods, args);
						
						let transaction = new ethereumjs.Tx({
							nonce : runSmartContractMethodInfo.nonce,
							gasPrice : web3.utils.toHex(INTEGER(gasPrice * 1000000000)),
							gasLimit : runSmartContractMethodInfo.gas,
							to : address,
							value : 0,
							data : method.encodeABI()
						});
						
						getPrivateKey({
							
							error : (errorMsg) => {
								runSmartContractMethodCallback({
									errorMsg : errorMsg
								});
							},
							
							success : (privateKey) => {
								
								transaction.sign(ethereumjs.Buffer.Buffer.from(privateKey, 'hex'));
								
								// 함수 실행
								web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (error, transactionHash) => {
									
									// 계약 실행 오류 발생
									if (error !== TO_DELETE) {
										runSmartContractMethodCallback({
											errorMsg : error.toString()
										});
									}
									
									// 정상 작동
									else {
										runSmartContractMethodCallback({
											transactionHash : transactionHash
										});
									}
								});
							}
						});
					}
				}
			});
			
			on('openGasCartoon', () => {
				
				openCartoonPopup({
					url : 'gascartoon.html',
					width : 588,
					height : 352
				});
			});
			
			on('getEtherBalance', (notUsing, callback) => {
				
				getAccountId((accountId) => {
					
					if (accountId !== undefined) {
						
						web3WS.eth.getBalance(accountId, (error, balance) => {
							
							// 오류 발생
							if (error !== TO_DELETE) {
								callback({
									errorMsg : error.toString()
								});
							}
							
							else {
								callback({
									balance : balance
								});
							}
						});
					}
				});
			});
			
			on('getERC20Balance', (addresses, callback) => {
				
				let erc20 = OBJECT({
					preset : () => {
						return DPlaySmartContract;
					},
					params : () => {
						return {
							abi : [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}],
							addresses : addresses
						};
					}
				});
				erc20.init();
				
				getAccountId((accountId) => {
					
					if (accountId !== undefined) {
						
						erc20.decimals((decimals) => {
							erc20.balanceOf(accountId, (balance) => {
								erc20.getAddress((address) => {
								
									callback({
										balance : +(balance / Math.pow(10, decimals)).toFixed(11),
										address : address
									});
								});
							});
						});
					}
				});
			});
			
			on('getERC721Ids', (params, callback) => {
				
				let addresses = params.addresses;
				let getItemIdsName = params.getItemIdsName;
				
				let erc721 = OBJECT({
					preset : () => {
						return DPlaySmartContract;
					},
					params : () => {
						
						let abi = [{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_approved","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"},{"name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":true,"name":"_tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_approved","type":"address"},{"indexed":true,"name":"_tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_operator","type":"address"},{"indexed":false,"name":"_approved","type":"bool"}],"name":"ApprovalForAll","type":"event"}];
						
						abi.push({"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":getItemIdsName,"outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"});
						
						return {
							abi : abi,
							addresses : addresses
						};
					}
				});
				erc721.init();
				
				getAccountId((accountId) => {
					
					if (accountId !== undefined) {
						
						erc721[getItemIdsName](accountId, (ids) => {
							
							erc721.getAddress((address) => {
								
								callback({
									ids : ids,
									address : address
								});
							});
						});
					}
				});
			});
			// 비밀번호를 지정합니다.
			on('setPassword', (_password, callback) => {
				password = _password;
				callback();
			});
			
			// 비밀번호가 존재하는지 확인합니다.
			on('checkPasswordExists', (notUsing, callback) => {
				callback(password !== undefined);
			});
			
			// 비밀번호를 삭제합니다.
			on('removePassword', (notUsing, callback) => {
				password = undefined;
				callback();
			});
			
			// 계정 ID를 저장합니다.
			on('saveAccountId', (accountId, callback) => {
				
				Crypto.encrypt({
					text : accountId,
					password : password
				}, {
					error : (errorMsg) => {
						callback({
							errorMsg : errorMsg
						});
					},
					success : (encryptedAccountId) => {
						
						browser.storage.local.set({
							accountId : encryptedAccountId
						}, () => {
							callback({
								isDone : true
							});
						});
					}
				});
			});
			
			// 저장된 갑 주소가 존재하는지 확인합니다.
			on('checkAccountIdExists', (notUsing, callback) => {
				
				browser.storage.local.get(['accountId'], (result) => {
					callback(result.accountId !== undefined);
				});
			});
			
			// 계정 ID를 반환합니다.
			on('getAccountId', (url, callback) => {
				
				if (url !== undefined) {
					
					browser.storage.local.get(['integrated-' + url], (result) => {
						
						// 연동 필요
						if (result['integrated-' + url] !== true) {
							callback(undefined);
						}
						
						else {
							getAccountId(callback);
						}
					});
				}
				
				else {
					getAccountId(callback);
				}
			});
			
			// 비밀키를 저장합니다.
			on('savePrivateKey', (privateKey, callback) => {
				
				Crypto.encrypt({
					text : privateKey,
					password : password
				}, {
					error : (errorMsg) => {
						callback({
							errorMsg : errorMsg
						});
					},
					success : (encryptedPrivateKey) => {
						
						browser.storage.local.set({
							privateKey : encryptedPrivateKey
						}, () => {
							callback({
								isDone : true
							});
						});
					}
				});
			});
			
			// 트랜잭션에 서명합니다.
			on('signTransaction', (transactionData, callback) => {
				
				getPrivateKey((privateKey) => {
					
					web3.eth.accounts.signTransaction(transactionData, '0x' + privateKey, (error, result) => {
						
						if (error !== TO_DELETE) {
							callback({
								errorMsg : error.toString()
							});
						}
						
						else {
							callback({
								rawTransaction : result.rawTransaction
							});
						}
					});
				});
			});
			
			// 문자열에 서명합니다.
			on('signText', (data, callback) => {
				
				/*openPopup({
					url : 'signtext.html',
					width : 340,
					height : 240
				});*/
				
				//TODO:
				
				signText(data, (signature) => {
					
					callback({
						signature : signature
					});
				});
			});
			
			// 초기화합니다.
			on('clear', (notUsing, callback) => {
				
				password = undefined;
				
				browser.storage.local.clear(() => {
					
					callback();
				});
			});
		});
	}
});