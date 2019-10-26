DPlayInventory.DSide = OBJECT({
	
	init : (inner, self) => {
		
		const HARD_CODED_URLS = [
			'218.38.19.34:8923',
			'175.207.29.151:8923',
			'218.38.12.135:8923',
			'218.38.12.134:8923',
			'218.38.19.48:8923',
			'218.38.19.49:8923',
			'49.247.128.219:8923',
			'34.202.162.93:8923',
			'35.159.18.198:8923',
			'35.234.34.128:8923'
		];
		
		let nodeURLs;
		
		let innerSendToNode;
		let innerOnFromNode;
		let innerOffFromNode;
		let timeDiffWithNode = 0;
		
		let waitingSendInfos = [];
		let onInfos = [];
		
		let sendToNode = (methodName, data, callback) => {
			
			if (innerSendToNode === undefined) {
				
				waitingSendInfos.push({
					params : {
						methodName : methodName,
						data : data
					},
					callback : callback
				});
				
			} else {
				
				innerSendToNode({
					methodName : methodName,
					data : data
				}, callback);
			}
		};
		
		let onFromNode = (methodName, method) => {
			
			onInfos.push({
				methodName : methodName,
				method : method
			});
	
			if (innerOnFromNode !== undefined) {
				innerOnFromNode(methodName, method);
			}
		};
		
		let offFromNode = (methodName, method) => {
			
			if (innerOffFromNode !== undefined) {
				innerOffFromNode(methodName, method);
			}
			
			if (method !== undefined) {
				
				REMOVE(onInfos, (onInfo) => {
					return onInfo.methodName === methodName && onInfo.method === method;
				});
				
			} else {
				
				REMOVE(onInfos, (onInfo) => {
					return onInfo.methodName === methodName;
				});
			}
		};
		
		let connectToFastestNode = () => {
			
			let isFoundFastestNode;
			
			// 모든 노드들에 연결합니다.
			EACH(nodeURLs, (url) => {
				
				let splits = url.split(':');
				
				CONNECT_TO_WEB_SOCKET_SERVER({
					host : splits[0],
					port : parseInt(splits[1])
				}, {
					error : () => {
						// 연결 오류를 무시합니다.
					},
					success : (on, off, send, disconnect) => {
						
						if (isFoundFastestNode !== true) {
							
							send('getNodeTime', (nodeTime) => {
								
								// 가장 빠른 노드를 찾았습니다.
								if (isFoundFastestNode !== true) {
									
									innerSendToNode = send;
									innerOnFromNode = on;
									innerOffFromNode = off;
									timeDiffWithNode = Date.now() - nodeTime;
									
									// 가장 빠른 노드를 찾고 난 뒤 대기중인 내용 실행
									EACH(onInfos, (onInfo) => {
										innerOnFromNode(onInfo.methodName, onInfo.method);
									});
									
									EACH(waitingSendInfos, (sendInfo) => {
										innerSendToNode(sendInfo.params, sendInfo.callback);
									});
									
									// 노드와의 접속이 끊어지면, 모든 내용을 초기화하고 다시 가장 빠른 노드를 찾습니다.
									on('__DISCONNECTED', () => {
										
										innerSendToNode = undefined;
										innerOnFromNode = undefined;
										innerOffFromNode = undefined;
										timeDiffWithNode = 0;
										
										waitingSendInfos = [];
										onInfos = [];
										
										connectToFastestNode();
										
										isAccountSigned = false;
										
										// retry login.
										login();
									});
									
									isFoundFastestNode = true;
								}
								
								else {
									disconnect();
								}
							});
						}
						
						else {
							disconnect();
						}
					}
				});
			});
		};
		
		let getNodeTime = self.getNodeTime = (date) => {
			//REQUIRED: date
			
			return new Date(date.getTime() - timeDiffWithNode);
		};
		
		let isSomeNodeConnected = false;
		
		// 하드코딩된 노드들의 URL로부터 최초 접속 노드를 찾습니다.
		EACH(HARD_CODED_URLS, (url) => {
			
			let splits = url.split(':');
			
			CONNECT_TO_WEB_SOCKET_SERVER({
				host : splits[0],
				port : parseInt(splits[1])
			}, {
				error : () => {
					// 연결 오류를 무시합니다.
				},
				success : (on, off, send, disconnect) => {
					
					if (isSomeNodeConnected !== true) {
						
						// 실제로 연결된 노드 URL 목록을 가져옵니다.
						send('getNodeURLs', (urls) => {
							
							if (isSomeNodeConnected !== true) {
								
								nodeURLs = urls;
								
								connectToFastestNode();
								
								isSomeNodeConnected = true;
							}
							
							disconnect();
						});
					}
					
					else {
						disconnect();
					}
				}
			});
		});
		
		// 특정 계정의 d 잔고를 가져옵니다.
		let getDBalance = self.getDBalance = (callback) => {
			//REQUIRED: callback
			
			DPlayInventory.Core.getAccountId((accountId) => {
				sendToNode('getDBalance', accountId, callback);
			});
		};
		
		let isAccountSigned = false;
		
		let checkAccountIsSigned = self.checkAccountIsSigned = () => {
			return isAccountSigned;
		};
		
		let seperateHandler = (callbackOrHandlers) => {
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.notValid
			//OPTIONAL: callbackOrHandlers.notVerified
			//OPTIONAL: callbackOrHandlers.notEnoughD
			//REQUIRED: callbackOrHandlers.success
			
			let notValidHandler;
			let notVerifiedHandler;
			let notEnoughDHandler;
			let callback;
			
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				notValidHandler = callbackOrHandlers.notValid;
				notVerifiedHandler = callbackOrHandlers.notVerified;
				notEnoughDHandler = callbackOrHandlers.notEnoughD;
				callback = callbackOrHandlers.success;
			}
			
			return (result) => {
				
				if (result.validErrors !== undefined) {
					if (notValidHandler !== undefined) {
						notValidHandler(result.validErrors);
					} else {
						SHOW_ERROR('DSide.saveAccountDetail', MSG({
							ko : '데이터가 유효하지 않습니다.'
						}), result.validErrors);
					}
				}
				
				else if (result.isNotVerified === true) {
					if (notVerifiedHandler !== undefined) {
						notVerifiedHandler();
					} else {
						SHOW_ERROR('DSide.saveAccountDetail', MSG({
							ko : '데이터가 유효하지 않습니다.'
						}));
					}
				}
				
				else if (result.isNotEnoughD === true) {
					if (notEnoughDHandler !== undefined) {
						notEnoughDHandler();
					} else {
						SHOW_ERROR('DSide.saveAccountDetail', MSG({
							ko : 'd가 부족합니다.'
						}));
					}
				}
				
				else {
					callback();
				}
			};
		};
		
		// 계정 상세 정보를 저장합니다.
		let saveAccountDetail = self.saveAccountDetail = (params, callbackOrHandlers) => {
			//REQUIRED: params
			//REQUIRED: params.hash
			//REQUIRED: params.data
			//REQUIRED: params.data.accountId
			//OPTIONAL: params.data.name
			//OPTIONAL: params.data.introduce
			//REQUIRED: params.data.createTime
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.notValid
			//OPTIONAL: callbackOrHandlers.notVerified
			//OPTIONAL: callbackOrHandlers.notEnoughD
			//REQUIRED: callbackOrHandlers.success
			
			sendToNode('saveAccountDetail', params, seperateHandler(callbackOrHandlers));
		};
		
		// 계정 상세 정보를 가져옵니다.
		let getAccountDetail = self.getAccountDetail = (accountId, callback) => {
			//REQUIRED: accountId
			//REQUIRED: callback
			
			sendToNode('getAccountDetail', accountId, callback);
		};
		
		// 길드를 생성합니다.
		let createGuild = self.createGuild = (params, callback) => {
			//REQUIRED: params
			//REQUIRED: params.hash
			//REQUIRED: params.data
			//REQUIRED: params.data.accountId
			//REQUIRED: params.data.id
			//OPTIONAL: params.data.name
			//OPTIONAL: params.data.introduce
			//REQUIRED: params.data.createTime
			
			sendToNode('createGuild', params, callback);
		};
		
		// 길드의 해시를 가져옵니다.
		let getGuildHash = self.getGuildHash = (guildId, callback) => {
			//REQUIRED: guildId
			//REQUIRED: callback
			
			sendToNode('getGuildHash', guildId, callback);
		};
		
		// 길드 정보를 수정합니다.
		let updateGuild = self.updateGuild = (params, callback) => {
			//REQUIRED: params
			//REQUIRED: params.hash
			//REQUIRED: params.data
			//REQUIRED: params.data.accountId
			//REQUIRED: params.data.id
			//OPTIONAL: params.data.name
			//OPTIONAL: params.data.introduce
			//REQUIRED: params.data.createTime
			//REQUIRED: params.data.lastUpdateTime
			
			sendToNode('updateGuild', params, callback);
		};
		
		// 특정 계정이 가입한 길드 ID를 가져옵니다.
		let getAccountGuildId = self.getAccountGuildId = (accountId, callback) => {
			//REQUIRED: accountId
			//REQUIRED: callback
			
			sendToNode('getAccountGuildId', accountId, callback);
		};
		
		// 특정 길드 정보를 가져옵니다.
		let getGuild = self.getGuild = (guildId, callback) => {
			//REQUIRED: guildId
			//REQUIRED: callback
			
			sendToNode('getGuild', guildId, callback);
		};
		
		// 길드를 폐쇄합니다.
		let removeGuild = self.removeGuild = (params, callback) => {
			//REQUIRED: params
			//REQUIRED: params.hash
			//REQUIRED: params.checkHash
			
			sendToNode('removeGuild', params, callback);
		};
		
		let login = self.login = (callback) => {
			//OPTIONAL: callback
			
			DPlayInventory.Core.getAccountId((accountId) => {
				
				sendToNode('generateLoginToken', undefined, (loginToken) => {
					
					DPlayInventory.Core.signText(loginToken, (hash) => {
						
						sendToNode('login', {
							hash : hash,
							accountId : accountId
						}, (isSucceed) => {
							
							if (isSucceed === true) {
								isAccountSigned = true;
								
								if (callback !== undefined) {
									callback();
								}
							}
						});
					});
				});
			});
		};
	}
});