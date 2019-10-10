window.DSide = (() => {
	
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
	
	let inner = Connector('DSide');
	let self = {};
	
	let networkName = 'Unknown';
	
	let setNetworkName = self.setNetworkName = (_networkName) => {
		//REQUIRED: networkName
		
		networkName = _networkName;
	};
	
	let timeDiffWithNode = 0;
	inner.send({
		methodName : 'getTimeDiffWithNode'
	}, (_timeDiffWithNode) => {
		timeDiffWithNode = _timeDiffWithNode;
	});
	
	let getNodeTime = self.getNodeTime = (date) => {
		//REQUIRED: date
		
		return new Date(date.getTime() - timeDiffWithNode);
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
	
	// 계정의 세부 정보를 가져옵니다.
	let getAccountDetail = self.getAccountDetail = (accountId, callback) => {
		//REQUIRED: accountId
		//REQUIRED: callback
		
		inner.send({
			methodName : 'getAccountDetail',
			data : accountId
		}, callback);
	};
	
	// 이름으로 계정을 찾습니다.
	let findAccounts = self.findAccounts = (nameQuery, callback) => {
		//REQUIRED: nameQuery
		//REQUIRED: callback
		
		inner.send({
			methodName : 'findAccounts',
			data : nameQuery
		}, callback);
	};
	
	// 친구 신청합니다.
	let requestFriend = self.requestFriend = (targetAccountId, callbackOrHandlers) => {
		//REQUIRED: targetAccountId
		//REQUIRED: callbackOrHandlers
		//OPTIONAL: callbackOrHandlers.notValid
		//OPTIONAL: callbackOrHandlers.notVerified
		//OPTIONAL: callbackOrHandlers.notEnoughD
		//REQUIRED: callbackOrHandlers.success
		
		inner.send({
			methodName : 'requestFriend',
			data : targetAccountId
		}, seperateHandler(callbackOrHandlers));
	};
	
	// 이미 친구 신청했는지 확인합니다.
	let checkFriendRequested = self.checkFriendRequested = (params, callback) => {
		//REQUIRED: params
		//REQUIRED: params.target
		//REQUIRED: params.accountId
		//REQUIRED: callback
		
		inner.send({
			methodName : 'checkFriendRequested',
			data : params
		}, callback);
	};
	
	// 친구 신청자들의 ID를 가져옵니다.
	let getFriendRequesterIds = self.getFriendRequesterIds = (accountId, callback) => {
		//REQUIRED: accountId
		//REQUIRED: callback
		
		inner.send({
			methodName : 'getFriendRequesterIds',
			data : accountId
		}, callback);
	};
	
	// 친구 요청을 거절합니다.
	let denyFriendRequest = self.denyFriendRequest = (requesterId, callback) => {
		//REQUIRED: requesterId
		//REQUIRED: callback
		
		inner.send({
			methodName : 'denyFriendRequest',
			data : requesterId
		}, callback);
	};
	
	// 친구 요청을 수락합니다.
	let acceptFriendRequest = self.acceptFriendRequest = (requesterId, callback) => {
		//REQUIRED: requesterId
		//REQUIRED: callback
		
		inner.send({
			methodName : 'acceptFriendRequest',
			data : requesterId
		}, callback);
	};
	
	// 친구들의 ID를 가져옵니다.
	let getFriendIds = self.getFriendIds = (accountId, callback) => {
		//REQUIRED: accountId
		//REQUIRED: callback
		
		inner.send({
			methodName : 'getFriendIds',
			data : accountId
		}, callback);
	};
	
	// 두 유저가 친구인지 확인합니다.
	let checkIsFriend = self.checkIsFriend = (params, callback) => {
		//REQUIRED: params
		//REQUIRED: params.accountId
		//REQUIRED: params.account2Id
		//REQUIRED: callback
		
		inner.send({
			methodName : 'checkIsFriend',
			data : params
		}, callback);
	};
	
	// 친구를 삭제합니다.
	let removeFriend = self.removeFriend = (friendId, callbackOrHandlers) => {
		//REQUIRED: friendId
		//REQUIRED: callbackOrHandlers
		//OPTIONAL: callbackOrHandlers.notValid
		//OPTIONAL: callbackOrHandlers.notVerified
		//REQUIRED: callbackOrHandlers.success
		
		inner.send({
			methodName : 'removeFriend',
			data : friendId
		}, seperateHandler(callbackOrHandlers));
	};
	
	// 회원수 순으로 길드 ID들을 가져옵니다.
	let getGuildIdsByMemberCount = self.getGuildIdsByMemberCount = (callback) => {
		//REQUIRED: callback
		
		inner.send({
			methodName : 'getGuildIdsByMemberCount',
		}, callback);
	};
	
	// 특정 유저가 가입한 길드 ID를 가져옵니다.
	let getAccountGuildId = self.getAccountGuildId = (accountId, callback) => {
		//REQUIRED: accountId
		//REQUIRED: callback
		
		inner.send({
			methodName : 'getAccountGuildId',
			data : accountId
		}, callback);
	};
	
	// 특정 길드 정보를 가져옵니다.
	let getGuild = self.getGuild = (guildId, callback) => {
		//REQUIRED: guildId
		//REQUIRED: callback
		
		inner.send({
			methodName : 'getGuild',
			data : guildId
		}, callback);
	};
	
	// 이름으로 길드를 찾습니다.
	let findGuilds = self.findGuilds = (nameQuery, callback) => {
		//REQUIRED: nameQuery
		//REQUIRED: callback
		
		inner.send({
			methodName : 'findGuilds',
			data : nameQuery
		}, callback);
	};
	
	// 길드 가입 신청합니다.
	let requestGuildJoin = self.requestGuildJoin = (targetGuildId, callbackOrHandlers) => {
		//REQUIRED: targetGuildId
		//REQUIRED: callbackOrHandlers
		//OPTIONAL: callbackOrHandlers.notValid
		//OPTIONAL: callbackOrHandlers.notVerified
		//OPTIONAL: callbackOrHandlers.notEnoughD
		//REQUIRED: callbackOrHandlers.success
		
		inner.send({
			methodName : 'requestGuildJoin',
			data : targetGuildId
		}, seperateHandler(callbackOrHandlers));
	};
	
	// 이미 길드 가입 신청했는지 확인합니다.
	let checkGuildJoinRequested = self.checkGuildJoinRequested = (params, callback) => {
		//REQUIRED: params
		//REQUIRED: params.target
		//REQUIRED: params.accountId
		//REQUIRED: callback
		
		inner.send({
			methodName : 'checkGuildJoinRequested',
			data : params
		}, callback);
	};
	
	// 길드 가입 신청자들의 ID를 가져옵니다.
	let getGuildJoinRequesterIds = self.getGuildJoinRequesterIds = (guildId, callback) => {
		//REQUIRED: guildId
		//REQUIRED: callback
		
		inner.send({
			methodName : 'getGuildJoinRequesterIds',
			data : guildId
		}, callback);
	};
	
	// 길드원들의 ID들을 가져옵니다.
	let getGuildMemberIds = self.getGuildMemberIds = (guildId, callback) => {
		//REQUIRED: guildId
		//REQUIRED: callback
		
		inner.send({
			methodName : 'getGuildMemberIds',
			data : guildId
		}, callback);
	};
	
	// 길드 가입 신청을 거절합니다.
	let denyGuildJoinRequest = self.denyGuildJoinRequest = (requesterId, callback) => {
		//REQUIRED: requesterId
		//REQUIRED: callback
		
		inner.send({
			methodName : 'denyGuildJoinRequest',
			data : requesterId
		}, callback);
	};
	
	// 길드 가입 신청을 수락합니다.
	let acceptGuildJoinRequest = self.acceptGuildJoinRequest = (requesterId, callbackOrHandlers) => {
		//REQUIRED: requesterId
		//REQUIRED: callbackOrHandlers
		//OPTIONAL: callbackOrHandlers.notValid
		//OPTIONAL: callbackOrHandlers.notVerified
		//OPTIONAL: callbackOrHandlers.notEnoughD
		//REQUIRED: callbackOrHandlers.success
		
		inner.send({
			methodName : 'acceptGuildJoinRequest',
			data : requesterId
		}, seperateHandler(callbackOrHandlers));
	};
	
	// 길드에서 탈퇴합니다.
	let leaveGuild = self.leaveGuild = (callback) => {
		//REQUIRED: callback
		
		inner.send({
			methodName : 'leaveGuild'
		}, callback);
	};
	
	// 길드에서 내쫒습니다.
	let banGuildMember = self.banGuildMember = (accountId, callback) => {
		//REQUIRED: accountId
		//REQUIRED: callback
		
		inner.send({
			methodName : 'banGuildMember',
			data : accountId
		}, callback);
	};
	
	// 대상에 참여합니다.
	let joinTarget = self.joinTarget = (target) => {
		//REQUIRED: target
		
		inner.send({
			methodName : 'joinTarget',
			data : networkName + '/' + target
		});
	};
	
	// 대상에서 나옵니다.
	let exitTarget = self.exitTarget = (target) => {
		//REQUIRED: target
		
		inner.send({
			methodName : 'exitTarget',
			data : networkName + '/' + target
		});
	};
	
	let getChatMessages = self.getChatMessages = (target, callback) => {
		//REQUIRED: target
		//REQUIRED: callback
		
		inner.send({
			methodName : 'getChatMessages',
			data : networkName + '/' + target
		}, callback);
	};
	
	let sendChatMessage = self.sendChatMessage = (params) => {
		//REQUIRED: params
		//REQUIRED: params.target
		//REQUIRED: params.message
		
		let target = params.target;
		let message = params.message;
		
		inner.send({
			methodName : 'sendChatMessage',
			data : {
				target : networkName + '/' + target,
				message : message
			}
		});
	};
	
	let onNewChatMessageHandlers = {};
	
	let onNewChatMessage = self.onNewChatMessage = (target, handler) => {
		//REQUIRED: target
		//REQUIRED: handler
		
		onNewChatMessageHandlers[networkName + '/' + target] = handler;
	};
	
	let offNewChatMessage = self.offNewChatMessage = (target) => {
		//REQUIRED: target
		
		let handler = onNewChatMessageHandlers[networkName + '/' + target];
		
		if (handler !== undefined) {
			delete onNewChatMessageHandlers[networkName + '/' + target];
		}
	};
	
	inner.on('newChatMessage', (data) => {
		EACH(onNewChatMessageHandlers, (handler, target) => {
			if (data.target === target) {
				handler(data);
			}
		});
	});
	
	let getPendingTransactions = self.getPendingTransactions = (target, callback) => {
		//REQUIRED: target
		//REQUIRED: callback
		
		inner.send({
			methodName : 'getPendingTransactions',
			data : networkName + '/' + target
		}, callback);
	};
	
	let sendPendingTransaction = self.sendPendingTransaction = (params) => {
		//REQUIRED: params
		//REQUIRED: params.target
		//REQUIRED: params.transactionHash
		//REQUIRED: params.message
		
		let target = params.target;
		let transactionHash = params.transactionHash;
		let message = params.message;
		
		inner.send({
			methodName : 'sendPendingTransaction',
			data : {
				target : networkName + '/' + target,
				network : networkName,
				transactionHash : transactionHash,
				message : message
			}
		});
	};
	
	let onNewPendingTransactionHandlers = {};
	
	let onNewPendingTransaction = self.onNewPendingTransaction = (target, handler) => {
		//REQUIRED: target
		//REQUIRED: handler
		
		onNewPendingTransactionHandlers[networkName + '/' + target] = handler;
	};
	
	let offNewPendingTransaction = self.offNewPendingTransaction = (target) => {
		//REQUIRED: target
		
		let handler = onNewPendingTransactionHandlers[networkName + '/' + target];
		
		if (handler !== undefined) {
			delete onNewPendingTransactionHandlers[networkName + '/' + target];
		}
	};
	
	inner.on('newPendingTransaction', (data) => {
		EACH(onNewPendingTransactionHandlers, (handler, target) => {
			if (data.target === target) {
				handler(data);
			}
		});
	});
	
	return self;
})();