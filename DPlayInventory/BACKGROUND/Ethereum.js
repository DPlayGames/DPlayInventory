global.Ethereum = OBJECT({

	preset : () => {
		return Connector;
	},
	
	params : () => {
		return 'Ethereum';
	},

	init : (inner, self) => {
		
		const NETWORK_ADDRESSES = {
			Mainnet : 'wss://mainnet.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
			Kovan : 'wss://kovan.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
			Ropsten : 'wss://ropsten.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
			Rinkeby : 'wss://rinkeby.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b'
		};
		
		//let networkName = 'Mainnet';
		let networkName = 'Kovan';
		
		let getNetworkName = self.getNetworkName = () => {
			return networkName;
		};
		
		let getProvider = () => {
			
			let provider = new Web3.providers.WebsocketProvider(NETWORK_ADDRESSES[networkName]);
			provider.on('end', (e) => {
				SHOW_ERROR('SmartContract', 'WebsocketProvider의 접속이 끊어졌습니다. 재접속합니다.');
				web3.setProvider(getProvider());
			});
			
			return provider;
		};
		
		let web3;
		
		let changeNetwork;
		
		// 비밀번호를 지정합니다.
		inner.on('changeNetwork', changeNetwork = (_networkName) => {
			
			networkName = _networkName;
			
			web3 = new Web3(getProvider());
			
			DELAY(() => {
				DPlayCoinContract.init();
				DPlayStoreContract.init();
				DPlayStoreSearchContract.init();
			});
		});
		
		changeNetwork(networkName);
		
		// 이더리움 네트워크 이름을 가져옵니다.
		inner.on('changeNetwork', (notUsing, callback) => {
			
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
		});
		
		let contracts = {};
		let methodMap = {};
		
		// 스마트 계약 인터페이스를 생성합니다.
		inner.on('changeNetwork', (params, callback) => {
			
			let abi = params.abi;
			let address = params.address;
			
			let contract = contracts[address] = new web3.eth.Contract(abi, address);
			
			// 계약의 이벤트 핸들링
			contract.events.allEvents((error, info) => {
				if (error === TO_DELETE) {
					
					let args = info.returnValues;
					
					EACH(info.args, (value, name) => {
						
						// 숫자인 경우
						if (value.toNumber !== undefined) {
							args[name] = value.toNumber();
						}
					});
					
					console.log(info.event, args);
				}
			});
			
			let methods = methodMap[address] = {};
			
			// 메소드 분석 및 생성
			EACH(abi, (methodInfo) => {
				if (methodInfo.type === 'function') {
					methods[methodInfo.name] = methodInfo;
				}
			});
			
			callback();
		});
		
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
		
		let runSmartContractMethod = self.runSmartContractMethod = (_params, callback) => {
			
			let address = _params.address;
			let methodName = _params.methodName;
			let params = _params.params;
			
			let contract = contracts[address];
			let methods = methodMap[address];
			
			if (contract !== undefined && methods !== undefined) {
				
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
						
						// constant 함수인 경우
						if (methodInfo.constant === true) {
							
							if (callback !== undefined) {
								
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
						}
						
						// 트랜잭션이 필요한 함수인 경우
						else if (callback !== undefined) {
							
							watchTransaction(result, {
								error : (errorMsg) => {
									callback({
										errorMsg : errorMsg
									});
								},
								success : () => {
									callback({});
								}
							});
						}
					}
				});
			}
		};
		
		// 스마트 계약의 메소드를 실행합니다.
		inner.on('runSmartContractMethod', runSmartContractMethod);
		
		inner.on('getEtherBalance', (notUsing, callback) => {
			
			SecureStore.getAccountId((result) => {
				
				if (result.accountId !== undefined) {
					
					web3.eth.getBalance(result.accountId, (error, balance) => {
						
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
		
		inner.on('getERC20Balance', (addresses, callback) => {
			
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
			
			SecureStore.getAccountId((result) => {
				
				if (result.accountId !== undefined) {
					
					erc20.decimals((decimals) => {
						erc20.balanceOf(result.accountId, (balance) => {
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
		
		inner.on('getERC721Ids', (params, callback) => {
			
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
			
			SecureStore.getAccountId((result) => {
				
				if (result.accountId !== undefined) {
					
					erc721[getItemIdsName](result.accountId, (ids) => {
						
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
	}
});