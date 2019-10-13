DPlayInventory.Core = OBJECT({
	
	init : (inner, self) => {
		
		const NETWORK_ADDRESSES = {
			Kovan : 'wss://kovan.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
			Ropsten : 'wss://ropsten.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
			Rinkeby : 'wss://rinkeby.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b'
		};
		
		const ERC20_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
		const ERC721_ABI = [{"constant":true,"inputs":[{"name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"approved","type":"address"},{"name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"operator","type":"address"},{"name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"},{"name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"approved","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"operator","type":"address"},{"indexed":false,"name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"}];
		
		let networkStore = DPlayInventory.SESSION_STORE('__NETWORK_STORE');
		
		let networkName = networkStore.get('networkName') !== undefined ? networkStore.get('networkName') : 'Kovan';
		
		let getProvider = () => {
			
			let provider = new Web3.providers.WebsocketProvider(NETWORK_ADDRESSES[networkName]);
			provider.on('end', (e) => {
				SHOW_ERROR('SmartContract', 'WebsocketProvider의 접속이 끊어졌습니다. 재접속합니다.');
				web3.setProvider(getProvider());
			});
			
			return provider;
		};
		
		let web3;
		
		let changeNetwork = self.changeNetwork = (_networkName, callback) => {
			//REQUIRED: networkName
			//OPTIONAL: callback
			
			// 테스트에서는 메인넷 금지
			if (_networkName === 'Mainnet') {
				_networkName = 'Kovan';
			}
			
			networkName = _networkName;
			
			networkStore.save({
				name : 'networkName',
				value : networkName
			});
			
			web3 = new Web3(getProvider());
			
			DPlaySmartContract.initAll(callback);
		};
		
		changeNetwork(networkName);
		
		let getChangeNetworkName = self.getChangeNetworkName = (callback) => {
			//REQUIRED: callback
			
			callback(networkName);
		};
		
		// 이더리움 네트워크 이름을 가져옵니다.
		let getNetworkName = self.getNetworkName = (callback) => {
			//REQUIRED: callback
			
			web3.eth.net.getId((error, netId) => {
				
				if (netId === 1) {
					callback('Mainnet');
				} else if (netId === 3) {
					callback('Ropsten');
				} else if (netId === 4) {
					callback('Rinkeby');
				} else if (netId === 42) {
					callback('Kovan');
				} else {
					callback('Unknown');
				}
			});
		};
		
		let contracts = {};
		let methodMap = {};
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
			
			let contract = contracts[address] = new web3.eth.Contract(abi, address);
			
			if (onEvent !== undefined) {
				
				// 계약의 이벤트 핸들링
				contract.events.allEvents((error, info) => {
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
								args[name] = web3.toChecksumAddress(value);
							}
						});
						
						onEvent(info.event, args);
					}
				});
			}
			
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
		
		// 트랜잭션이 완료될 때 까지 확인합니다.
		let watchTransaction = (transactionHash, callbackOrHandlers) => {
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
			
			let retry = RAR(() => {
				
				web3.eth.getTransactionReceipt(transactionHash, (error, result) => {
					
					// 트랜잭선 오류 발생
					if (error !== TO_DELETE) {
						if (errorHandler !== undefined) {
							errorHandler(error.toString());
						} else {
							SHOW_ERROR(transactionHash, error.toString(), params);
						}
					}
					
					// 아무런 값이 없으면 재시도
					else if (result === TO_DELETE || result.blockHash === TO_DELETE) {
						retry();
					}
					
					// 트랜잭선 오류 발생
					else if (result.status === '0x0') {
						if (errorHandler !== undefined) {
							errorHandler('Transaction Error');
						} else {
							SHOW_ERROR(methodInfo.name, 'Transaction Error', params);
						}
					}
					
					// 트랜잭션 완료
					else {
						callback();
					}
				});
			});
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
		
		// 스마트 계약의 메소드를 실행합니다.
		let runSmartContractMethod = self.runSmartContractMethod = (_params, callbackOrHandlers) => {
			//REQUIRED: params
			//REQUIRED: params.address
			//REQUIRED: params.methodName
			//REQUIRED: params.params
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			let address = _params.address;
			let methodName = _params.methodName;
			let params = _params.params;
			
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
			
			let contract = contracts[address];
			let methods = methodMap[address];
			
			if (contract !== undefined && methods !== undefined && methods[methodName] !== undefined) {
				
				let methodInfo = methods[methodName];
				
				let args = [];
				
				// 파라미터가 파라미터가 없거나 1개인 경우
				if (methodInfo.payable !== true && methodInfo.inputs.length <= 1) {
					if (methodInfo.inputs.length !== 0) {
						args.push(params);
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
							args.push(params[input.name]);
						} else {
							args.push(paramsArray[i]);
						}
					});
				}
				
				// constant 함수인 경우
				if (methodInfo.constant === true) {
					
					// 함수 실행
					contract.methods[methodInfo.name].apply(contract.methods, args).call((error, result) => {
						
						// 계약 실행 오류 발생
						if (error !== TO_DELETE) {
							if (errorHandler !== undefined) {
								errorHandler(error.toString());
							} else {
								SHOW_ERROR(methodInfo.name, error.toString(), params);
							}
						}
						
						// 정상 작동
						else {
							
							if (callback !== undefined) {
								
								// output이 없는 경우
								if (methodInfo.outputs.length === 0) {
									callback();
								}
								
								// output이 1개인 경우
								else if (methodInfo.outputs.length === 1) {
									result = cleanResult(methodInfo.outputs, result);
									callback(result.value, result.str);
								}
								
								// output이 여러개인 경우
								else if (methodInfo.outputs.length > 1) {
									result = cleanResult(methodInfo.outputs, result);
									callback.apply(TO_DELETE, result.array);
								}
							}
						}
					});
				}
				
				// 트랜잭션이 필요한 함수인 경우
				else {
					
					getAccountId((accountId) => {
						
						web3.eth.getTransactionCount(accountId, 'pending', (error, nonce) => {
							
							if (error !== TO_DELETE) {
								if (errorHandler !== undefined) {
									errorHandler(error.toString());
								} else {
									SHOW_ERROR(methodInfo.name, error.toString(), params);
								}
							}
							
							else {
								
								let method = contract.methods[methodInfo.name].apply(contract.methods, args);
								
								method.estimateGas({
									from : accountId
								}, (error, gas) => {
									
									if (error !== TO_DELETE) {
										if (errorHandler !== undefined) {
											errorHandler(error.toString());
										} else {
											SHOW_ERROR(methodInfo.name, error.toString(), params);
										}
									}
									
									else {
										
										GET('https://ethgasstation.info/json/ethgasAPI.json', {
											
											error : (errorMsg) => {
												if (errorHandler !== undefined) {
													errorHandler(errorMsg);
												} else {
													SHOW_ERROR(methodInfo.name, errorMsg, params);
												}
											},
											
											success : (gasPrices) => {
												gasPrices = PARSE_STR(gasPrices);
												
												let transaction = new ethereumjs.Tx({
													nonce : nonce,
													gasPrice : web3.utils.toHex(web3.utils.toWei(new web3.utils.BN(gasPrices.fast / 10), 'gwei')),
													gasLimit : gas,
													to : address,
													value : 0,
													data : method.encodeABI()
												});
												
												getPrivateKey({
													error : errorHandler,
													success : (privateKey) => {
														
														transaction.sign(ethereumjs.Buffer.Buffer.from(privateKey, 'hex'));
														
														// 함수 실행
														web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (error, transactionHash) => {
															
															// 계약 실행 오류 발생
															if (error !== TO_DELETE) {
																if (errorHandler !== undefined) {
																	errorHandler(error.toString());
																} else {
																	SHOW_ERROR(methodInfo.name, error.toString(), params);
																}
															}
															
															// 정상 작동
															else {
																
																if (transactionHashCallback !== undefined) {
																	transactionHashCallback(transactionHash);
																}
																
																if (callback !== undefined) {
																	watchTransaction(transactionHash, {
																		error : errorHandler,
																		success : callback
																	});
																}
															}
														});
													}
												});
											}
										});
									}
								});
							}
						});
					});
				}
			}
		};
		
		let getRunSmartContractMethodInfo = self.getRunSmartContractMethodInfo = (callback) => {
			//REQUIRED: callback
			
			callback({
				title : 'TEST GAME',
				favicon : 'http://delight.game/Delight/R/favicon.ico',
				address : '0xddD4afA1a399099BA6D8841dbbDC57085420c098',
				methodName : 'runOrderQueue',
				params : {
					accountId: "0xEcCFaA737a5A80bE37e4E70130628E692413cB36",
					orderIds: ["4f67693e-a96f-4da8-a6c4-6814751ae64b"],
					orders: [8],
					params1: [12],
					params2: [6],
					params3: [15],
					params4: [6]
				},
				nonce : 2773,
				gasPriceAverage : 1,
				gasPriceFast : 10,
				gas : 383600
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
			
			getAccountId((accountId) => {
				
				web3.eth.getBalance(accountId, (error, balance) => {
					
					// 오류 발생
					if (error !== TO_DELETE) {
						if (errorHandler !== undefined) {
							errorHandler(error.toString());
						} else {
							SHOW_ERROR('Ethereum.getEtherBalance', error.toString());
						}
					}
					
					else {
						callback(balance);
					}
				});
			});
		};
		
		let getDisplayPrice = self.getDisplayPrice = (actualPrice) => {
			return web3.utils.fromWei(actualPrice, 'ether');
		};
		
		let getActualPrice = self.getActualPrice = (displayPrice) => {
			return web3.utils.toWei(displayPrice, 'ether');
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
			
			let erc20 = OBJECT({
				preset : () => {
					return DPlaySmartContract;
				},
				params : () => {
					return {
						abi : ERC20_ABI,
						addresses : addresses
					};
				}
			});
			erc20.init();
			
			getAccountId((accountId) => {
				erc20.decimals((decimals) => {
					erc20.balanceOf(accountId, (balance) => {
						callback(+(balance / Math.pow(10, decimals)).toFixed(11));
					});
				});
			});
		};
		
		let getERC721Ids = self.getERC721Ids = (params, callbackOrHandlers) => {
			//REQUIRED: params
			//REQUIRED: params.addresses
			//REQUIRED: params.getItemIdsName
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			let addresses = params.addresses;
			let getItemIdsName = params.getItemIdsName;
			
			let callback;
			let errorHandler;
			
			// 콜백 정리
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				callback = callbackOrHandlers.success;
				errorHandler = callbackOrHandlers.error;
			}
			
			let erc721 = OBJECT({
				preset : () => {
					return DPlaySmartContract;
				},
				params : () => {
					
					let abi = COPY(ERC721_ABI);
					
					abi.push({"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":getItemIdsName,"outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"});
					
					return {
						abi : abi,
						addresses : addresses
					};
				}
			});
			erc721.init();
			
			getAccountId((accountId) => {
				erc721[getItemIdsName](accountId, (ids) => {
					callback(ids);
				});
			});
		};
		
		let getERC721Owner = self.getERC721Owner = (params, callbackOrHandlers) => {
			//REQUIRED: params
			//REQUIRED: params.addresses
			//REQUIRED: params.id
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			let addresses = params.addresses;
			let id = params.id;
			
			let callback;
			let errorHandler;
			
			// 콜백 정리
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				callback = callbackOrHandlers.success;
				errorHandler = callbackOrHandlers.error;
			}
			
			let erc721 = OBJECT({
				preset : () => {
					return DPlaySmartContract;
				},
				params : () => {
					
					let abi = COPY(ERC721_ABI);
					
					abi.push({"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":getItemIdsName,"outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"});
					
					return {
						abi : abi,
						addresses : addresses
					};
				}
			});
			erc721.init();
			
			erc721.ownerOf(id, (owner) => {
				callback(owner);
			});
		};
		
		let transferERC20 = self.transferERC20 = (params, callbackOrHandlers) => {
			//REQUIRED: params
			//REQUIRED: params.addresses
			//REQUIRED: params.amount
			//REQUIRED: params.to
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			let addresses = params.addresses;
			let amount = params.amount;
			let to = params.to;
			
			let callback;
			let errorHandler;
			
			// 콜백 정리
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				callback = callbackOrHandlers.success;
				errorHandler = callbackOrHandlers.error;
			}
			
			let erc20 = OBJECT({
				preset : () => {
					return DPlaySmartContract;
				},
				params : () => {
					return {
						abi : ERC20_ABI,
						addresses : addresses
					};
				}
			});
			erc20.init();
			
			erc20.transfer({
				to : to,
				value : amount
			}, () => {
				callback();
			});
		};
		
		let transferERC721 = self.transferERC721 = (params, callbackOrHandlers) => {
			//REQUIRED: params
			//REQUIRED: params.addresses
			//REQUIRED: params.id
			//REQUIRED: params.to
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			let addresses = params.addresses;
			let id = params.id;
			let to = params.to;
			
			let callback;
			let errorHandler;
			
			// 콜백 정리
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				callback = callbackOrHandlers.success;
				errorHandler = callbackOrHandlers.error;
			}
			
			let erc721 = OBJECT({
				preset : () => {
					return DPlaySmartContract;
				},
				params : () => {
					
					let abi = COPY(ERC721_ABI);
					
					abi.push({"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":getItemIdsName,"outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"});
					
					return {
						abi : abi,
						addresses : addresses
					};
				}
			});
			erc721.init();
			
			getAccountId((accountId) => {
				erc721.transferFrom({
					from : accountId,
					to : to,
					tokenId : id
				}, () => {
					callback();
				});
			});
		};
		
		let testSessionStore = DPlayInventory.SESSION_STORE('__TEST_SESSION_STORE');
		let testSecureStore = DPlayInventory.STORE('__TEST_SECURE_STORE');
		
		let setPassword = self.setPassword = (password, callback) => {
			//REQUIRED: password
			//REQUIRED: callback
			
			testSessionStore.save({
				name : 'password',
				value : password
			});
			
			callback();
		};
		
		let checkPasswordExists = self.checkPasswordExists = (callback) => {
			//REQUIRED: callback
			
			callback(testSessionStore.get('password') !== undefined);
		};
		
		let removePassword = self.removePassword = (callback) => {
			//REQUIRED: callback
			
			testSessionStore.remove('password');
			callback();
		};
		
		let saveAccountId = self.saveAccountId = (accountId, callbackOrHandlers) => {
			//REQUIRED: accountId
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
			
			DPlayInventoryTest.Crypto.encrypt({
				text : accountId,
				password : testSessionStore.get('password')
			}, {
				error : errorHandler,
				success : (encryptedAccountId) => {
					
					testSecureStore.save({
						name : 'accountId',
						value : encryptedAccountId
					});
					
					callback();
				}
			});
		};
		
		let checkAccountIdExists = self.checkAccountIdExists = (callback) => {
			//REQUIRED: callback
			
			callback(testSecureStore.get('accountId') !== undefined);
		};
		
		let getAccountId = self.getAccountId = (callbackOrHandlers) => {
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
			
			DPlayInventoryTest.Crypto.decrypt({
				encryptedText : testSecureStore.get('accountId'),
				password : testSessionStore.get('password')
			}, callbackOrHandlers);
		};
		
		let savePrivateKey = self.savePrivateKey = (privateKey, callbackOrHandlers) => {
			//REQUIRED: privateKey
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
			
			DPlayInventoryTest.Crypto.encrypt({
				text : privateKey,
				password : testSessionStore.get('password')
			}, {
				error : errorHandler,
				success : (encryptedAccountId) => {
					
					testSecureStore.save({
						name : 'privateKey',
						value : encryptedAccountId
					});
					
					callback();
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
			
			DPlayInventoryTest.Crypto.decrypt({
				encryptedText : testSecureStore.get('privateKey'),
				password : testSessionStore.get('password')
			}, callbackOrHandlers);
		};
		
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
			
			getPrivateKey({
				error : errorHandler,
				success : (privateKey) => {
					
					let i, length, c;
					for(length = i = 0; c = text.charCodeAt(i++); length += c >> 11 ? 3 : c >> 7 ? 2 : 1);
					
					let prefixedMessage = ethereumjs.Util.sha3('\x19Ethereum Signed Message:\n' + length + text);
					let signedMessage = ethereumjs.Util.ecsign(prefixedMessage, ethereumjs.Util.toBuffer('0x' + privateKey));
					
					callback(ethereumjs.Util.toRpcSig(signedMessage.v, signedMessage.r, signedMessage.s).toString('hex'));
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
		
		let clear = self.clear = (callback) => {
			//REQUIRED: callback
			
			testSessionStore.clear();
			testSecureStore.clear();
			callback();
		};
	}
});