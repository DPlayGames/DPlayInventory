global.DSide = OBJECT({

	preset : () => {
		return Connector;
	},
	
	params : () => {
		return {
			pack : 'DSide'
		};
	},

	init : (inner, self) => {
		
		const HARD_CODED_URLS = [
			'218.38.19.34:8923',
			'175.207.29.151:8923'
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
		
		inner.on('getTimeDiffWithNode', (notUsing, callback) => {
			callback(timeDiffWithNode);
		});
		
		// 특정 계정의 d 잔고를 가져옵니다.
		inner.on('getDBalance', (notUsing, callback) => {
			
			DPlayInventory.getAccountId((accountId) => {
				
				if (accountId !== undefined) {
					
					sendToNode('getDBalance', accountId, callback);
				}
			});
		});
		
		// 특정 계정의 d 잔고를 가져옵니다.
		inner.on('saveAccountDetail', (params, callback) => {
			sendToNode('saveAccountDetail', params, callback);
		});
		
		// 계정 상세 정보를 가져옵니다.
		inner.on('getAccountDetail', (accountId, callback) => {
			sendToNode('getAccountDetail', accountId, callback);
		});
		
		// 이름으로 계정을 찾습니다.
		inner.on('findAccounts', (nameQuery, callback) => {
			sendToNode('findAccounts', nameQuery, callback);
		});
		
		// 친구 신청합니다.
		inner.on('requestFriend', (targetAccountId, callback) => {
			
			DPlayInventory.getAccountId((accountId) => {
				
				let data = {
					target : targetAccountId,
					accountId : accountId,
					createTime : new Date()
				};
				
				DPlayInventory.signData(data, (hash) => {
					
					sendToNode('requestFriend', {
						data : data,
						hash : hash
					}, callback);
				});
			});
		});
		
		// 이미 친구 신청했는지 확인합니다.
		inner.on('checkFriendRequested', (params, callback) => {
			sendToNode('checkFriendRequested', params, callback);
		});
		
		// 친구 신청자들의 ID를 가져옵니다.
		inner.on('getFriendRequesterIds', (accountId, callback) => {
			sendToNode('getFriendRequesterIds', accountId, callback);
		});
		
		// 친구 요청을 거절합니다.
		inner.on('denyFriendRequest', (requesterId, callback) => {
			
			DPlayInventory.getAccountId((accountId) => {
				
				let data = {
					target : accountId,
					accountId : requesterId
				};
				
				DPlayInventory.signData(data, (hash) => {
					
					sendToNode('denyFriendRequest', {
						target : accountId,
						accountId : requesterId,
						hash : hash
					});
					
					callback();
				});
			});
		});
		
		// 친구 요청을 수락합니다.
		inner.on('acceptFriendRequest', (requesterId, callback) => {
			
			DPlayInventory.getAccountId((accountId) => {
				
				let data = {
					accountId : accountId,
					account2Id : requesterId,
					createTime : new Date()
				};
				
				DPlayInventory.signData(data, (hash) => {
					
					sendToNode('acceptFriendRequest', {
						data : data,
						hash : hash
					}, callback);
				});
			});
		});
		
		// 친구들의 ID를 가져옵니다.
		inner.on('getFriendIds', (accountId, callback) => {
			sendToNode('getFriendIds', accountId, callback);
		});
		
		// 두 유저가 친구인지 확인합니다.
		inner.on('checkIsFriend', (params, callback) => {
			sendToNode('checkIsFriend', params, callback);
		});
		
		// 친구들의 ID를 가져옵니다.
		inner.on('removeFriend', (friendId, callback) => {
			
			DPlayInventory.signText(friendId, (hash) => {
				
				sendToNode('removeFriend', {
					friendId : friendId,
					hash : hash
				}, callback);
			});
		});
		
		// 회원수 순으로 길드 ID들을 가져옵니다.
		inner.on('getGuildIdsByMemberCount', (notUsing, callback) => {
			sendToNode('getGuildIdsByMemberCount', undefined, callback);
		});
		
		// 이름으로 길드를 찾습니다.
		inner.on('findGuilds', (nameQuery, callback) => {
			sendToNode('findGuilds', nameQuery, callback);
		});
		
		// 길드를 생성합니다.
		inner.on('createGuild', (params, callback) => {
			sendToNode('createGuild', params, callback);
		});
		
		// 길드의 해시를 가져옵니다.
		inner.on('getGuildHash', (guildId, callback) => {
			sendToNode('getGuildHash', guildId, callback);
		});
		
		// 길드 정보를 수정합니다.
		inner.on('updateGuild', (params, callback) => {
			sendToNode('updateGuild', params, callback);
		});
		
		let getAccountGuildId = (accountId, callback) => {
			sendToNode('getAccountGuildId', accountId, callback);
		};
		
		// 특정 계정이 가입한 길드 ID를 가져옵니다.
		inner.on('getAccountGuildId', getAccountGuildId);
		
		let getGuild = (guildId, callback) => {
			sendToNode('getGuild', guildId, callback);
		};
		
		// 특정 길드 정보를 가져옵니다.
		inner.on('getGuild', getGuild);
		
		// 길드를 폐쇄합니다.
		inner.on('removeGuild', (params, callback) => {
			sendToNode('removeGuild', params, callback);
		});
		
		// 길드 가입 신청합니다.
		inner.on('requestGuildJoin', (targetGuildId, callback) => {
			
			DPlayInventory.getAccountId((accountId) => {
				
				let data = {
					target : targetGuildId,
					accountId : accountId,
					createTime : new Date()
				};
				
				DPlayInventory.signData(data, (hash) => {
					
					sendToNode('requestGuildJoin', {
						data : data,
						hash : hash
					}, callback);
				});
			});
		});
		
		// 이미 길드 가입 신청했는지 확인합니다.
		inner.on('checkGuildJoinRequested', (params, callback) => {
			sendToNode('checkGuildJoinRequested', params, callback);
		});
		
		// 길드 가입 신청자들의 ID를 가져옵니다.
		inner.on('getGuildJoinRequesterIds', (guildId, callback) => {
			sendToNode('getGuildJoinRequesterIds', guildId, callback);
		});
		
		// 길드원들의 ID들을 가져옵니다.
		inner.on('getGuildMemberIds', (guildId, callback) => {
			sendToNode('getGuildMemberIds', guildId, callback);
		});
		
		// 길드 가입 신청을 거절합니다.
		inner.on('denyGuildJoinRequest', (requesterId, callback) => {
			
			DPlayInventory.getAccountId((accountId) => {
				
				getAccountGuildId(accountId, (guildId) => {
					
					let data = {
						target : guildId,
						accountId : requesterId
					};
					
					DPlayInventory.signData(data, (hash) => {
						
						sendToNode('denyGuildJoinRequest', {
							target : guildId,
							accountId : requesterId,
							hash : hash
						});
						
						callback();
					});
				});
			});
		});
		
		// 길드 가입 신청을 수락합니다.
		inner.on('acceptGuildJoinRequest', (requesterId, callback) => {
			
			DPlayInventory.getAccountId((accountId) => {
				
				getAccountGuildId(accountId, (guildId) => {
					
					let data = {
						target : guildId,
						createTime : new Date()
					};
					
					DPlayInventory.signData(data, (hash) => {
						
						sendToNode('acceptGuildJoinRequest', {
							target : guildId,
							id : requesterId,
							data : data,
							hash : hash
						});
						
						callback();
					});
				});
			});
		});
		
		// 길드에서 탈퇴합니다.
		inner.on('leaveGuild', (notUsing, callback) => {
			
			DPlayInventory.getAccountId((accountId) => {
				
				getAccountGuildId(accountId, (guildId) => {
					
					DPlayInventory.signText(accountId, (hash) => {
						
						sendToNode('leaveGuild', {
							target : guildId,
							id : accountId,
							hash : hash
						});
						
						callback();
					});
				});
			});
		});
		
		let isAccountSigned = false;
		
		let login = (callback) => {
			
			if (isAccountSigned === true) {
				
				if (callback !== undefined) {
					callback();
				}
			}
			
			else {
				
				DPlayInventory.getAccountId((accountId) => {
					
					if (accountId !== undefined) {
						
						sendToNode('generateLoginToken', undefined, (loginToken) => {
							
							DPlayInventory.signText(loginToken, (hash) => {
								
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
					}
				});
			}
		};
		
		inner.on('login', (notUsing, callback) => {
			login(callback);
		});
		
		let eventPorts = {};
		chrome.runtime.onConnect.addListener((eventPort) => {
			eventPort.onMessage.addListener((clientId) => {
				
				if (eventPort.name === '__DSIDE_EVENT') {
					eventPorts[clientId] = eventPort;
					eventPort.onDisconnect.addListener(() => {
						delete eventPorts[clientId];
					});
				}
			});
		});
		
		let targetClientIds = {};
		
		// 대상에 참여합니다.
		inner.on('joinTarget', (params, callback) => {
			
			let clientId = params.clientId;
			let target = params.target;
			
			if (targetClientIds[target] === undefined) {
				targetClientIds[target] = [];
				
				sendToNode('joinTarget', target);
			}
			
			if (CHECK_IS_IN({
				array : targetClientIds[target],
				value : clientId
			}) !== true) {
				targetClientIds[target].push(clientId);
			}
		});
		
		// 대상에서 나옵니다.
		inner.on('exitTarget', (params, callback) => {
			
			let clientId = params.clientId;
			let target = params.target;
			
			if (targetClientIds[target] !== undefined) {
				
				REMOVE({
					array : targetClientIds[target],
					value : clientId
				});
				
				if (targetClientIds[target].length === 0) {	
					sendToNode('exitTarget', target);
					delete targetClientIds[target];
				}
			}
		});
		
		onFromNode('newChatMessage', (data) => {
			
			if (targetClientIds[data.target] !== undefined) {
				EACH(targetClientIds[data.target], (clientId) => {
					
					if (eventPorts[clientId] !== undefined) {
						eventPorts[clientId].postMessage({
							methodName : 'newChatMessage',
							data : data
						});
					}
				});
			}
		});
		
		onFromNode('newPendingTransaction', (data) => {
			
			if (targetClientIds[data.target] !== undefined) {
				EACH(targetClientIds[data.target], (clientId) => {
					
					if (eventPorts[clientId] !== undefined) {
						eventPorts[clientId].postMessage({
							methodName : 'newPendingTransaction',
							data : data
						});
					}
				});
			}
		});
		
		inner.on('getChatMessages', (target, callback) => {
			sendToNode('getChatMessages', target, callback);
		});
		
		inner.on('sendChatMessage', (params) => {
			sendToNode('sendChatMessage', params);
		});
		
		inner.on('getPendingTransactions', (target, callback) => {
			sendToNode('getPendingTransactions', target, callback);
		});
		
		inner.on('sendPendingTransaction', (params) => {
			sendToNode('sendPendingTransaction', params);
		});
	}
});