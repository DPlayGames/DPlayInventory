global.DPlayInventory = OBJECT({

	preset : () => {
		return Connector;
	},
	
	params : () => {
		return {
			pack : 'DPlayInventory'
		};
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
		
		// 네트워크를 변경합니다.
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
		inner.on('getNetworkName', (notUsing, callback) => {
			
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
		let eventMap = {};
		
		let createSmartContractInterface = self.createSmartContractInterface = (params, callback) => {
			
			let abi = params.abi;
			let address = params.address;
			
			let contract = contracts[address] = new web3.eth.Contract(abi, address);
			
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
					
					inner.send({
						methodName : '__CONTRACT_EVENT',
						data : {
							address : address,
							eventName : info.event,
							args : args
						}
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
		
		// 스마트 계약 인터페이스를 생성합니다.
		inner.on('createSmartContractInterface', createSmartContractInterface);
		
		// 트랜잭션이 완료될 때 까지 확인합니다.
		let watchTransaction = (transactionHash, callback) => {
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
					
					// 트랜잭션 완료
					else {
						callback({});
					}
				});
			});
		};
		
		inner.on('watchTransaction', watchTransaction);
		
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
							watchTransaction(result, callback);
						}
					}
				});
			}
		};
		
		// 스마트 계약의 메소드를 실행합니다.
		inner.on('runSmartContractMethod', runSmartContractMethod);
		
		inner.on('getEtherBalance', (notUsing, callback) => {
			
			getAccountId((result) => {
				
				if (result.accountId !== undefined) {
					
					web3.eth.getBalance(result.accountId, (error, balanceBN) => {
						
						// 오류 발생
						if (error !== TO_DELETE) {
							callback({
								errorMsg : error.toString()
							});
						}
						
						else {
							callback({
								balance : web3.fromWei(balanceBN.toNumber(), 'ether')
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
			
			getAccountId((result) => {
				
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
			
			getAccountId((result) => {
				
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
		
		let password;
		
		// 비밀번호를 지정합니다.
		inner.on('setPassword', (_password, callback) => {
			password = _password;
			callback();
		});
		
		// 비밀번호가 존재하는지 확인합니다.
		inner.on('checkPasswordExists', (notUsing, callback) => {
			callback(password !== undefined);
		});
		
		// 비밀번호를 삭제합니다.
		inner.on('removePassword', (notUsing, callback) => {
			password = undefined;
			callback();
		});
		
		// 계정 ID를 저장합니다.
		inner.on('saveAccountId', (accountId, callback) => {
			
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
					
					chrome.storage.local.set({
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
		inner.on('checkAccountIdExists', (notUsing, callback) => {
			
			chrome.storage.local.get(['accountId'], (result) => {
				callback(result.accountId !== undefined);
			});
		});
		
		let getAccountId = self.getAccountId = (callback) => {
			
			chrome.storage.local.get(['accountId'], (result) => {
				
				if (result.accountId === undefined) {
					callback({});
				}
				
				else {
					
					Crypto.decrypt({
						encryptedText : result.accountId,
						password : password
					}, {
						error : (errorMsg) => {
							callback({
								errorMsg : errorMsg
							});
						},
						success : (accountId) => {
							callback({
								accountId : accountId
							});
						}
					});
				}
			});
		};
		
		// 계정 ID를 반환합니다.
		inner.on('getAccountId', (notUsing, callback) => {
			getAccountId((result) => {
				callback(result.accountId);
			});
		});
		
		// 비밀키를 저장합니다.
		inner.on('savePrivateKey', (privateKey, callback) => {
			
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
					
					chrome.storage.local.set({
						privateKey : encryptedPrivateKey
					}, () => {
						callback({
							isDone : true
						});
					});
				}
			});
		});
		
		let getPrivateKey = (ret, callback) => {
			
			chrome.storage.local.get(['privateKey'], (result) => {
				
				Crypto.decrypt({
					encryptedText : result.privateKey,
					password : password
				}, {
					error : (errorMsg) => {
						ret({
							errorMsg : errorMsg
						});
					},
					success : callback
				});
			});
		};
		
		// 트랜잭션에 서명합니다.
		inner.on('signTransaction', (transactionData, callback) => {
			
			getPrivateKey(callback, (privateKey) => {
				
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
		
		let signText = self.signText = (text, callback) => {
			
			getPrivateKey(callback, (privateKey) => {
				
				let i, length, c;
				for(length = i = 0; c = text.charCodeAt(i++); length += c >> 11 ? 3 : c >> 7 ? 2 : 1);
				
				let prefixedMessage = ethereumjs.Util.sha3('\x19Ethereum Signed Message:\n' + length + text);
				let signedMessage = ethereumjs.Util.ecsign(prefixedMessage, ethereumjs.Util.toBuffer('0x' + privateKey));
				
				callback(ethereumjs.Util.toRpcSig(signedMessage.v, signedMessage.r, signedMessage.s).toString('hex'));
			});
		};
		
		// 문자열에 서명합니다.
		inner.on('signText', (data, callback) => {
			
			signText(data, (signature) => {
				
				callback({
					signature : signature
				});
			});
		});
		
		// 초기화합니다.
		inner.on('clear', (notUsing, callback) => {
			
			password = undefined;
			
			chrome.storage.local.clear(() => {
				
				callback();
			});
		});
	}
});