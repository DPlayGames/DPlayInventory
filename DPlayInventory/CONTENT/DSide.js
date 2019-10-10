window.DSide = (() => {
	
	let inner = Connector('DSide');
	let self = {};
	
	inner.on('getTimeDiffWithNode', (notUsing, callback) => {
		inner.sendToBackground({
			methodName : 'getTimeDiffWithNode'
		}, callback);
	});
	
	// 계정의 세부 정보를 가져옵니다.
	inner.on('getAccountDetail', (accountId, callback) => {
		inner.sendToBackground({
			methodName : 'getAccountDetail',
			data : accountId
		}, callback);
	});
	
	// 이름으로 계정을 찾습니다.
	inner.on('findAccounts', (nameQuery, callback) => {
		inner.sendToBackground({
			methodName : 'findAccounts',
			data : nameQuery
		}, callback);
	});
	
	// 친구 신청합니다.
	inner.on('requestFriend', (targetAccountId, callback) => {
		inner.sendToBackground({
			methodName : 'requestFriend',
			data : targetAccountId
		}, callback);
	});
	
	// 이미 친구 신청했는지 확인합니다.
	inner.on('checkFriendRequested', (params, callback) => {
		inner.sendToBackground({
			methodName : 'checkFriendRequested',
			data : params
		}, callback);
	});
	
	// 친구 신청자들의 ID를 가져옵니다.
	inner.on('getFriendRequesterIds', (accountId, callback) => {
		inner.sendToBackground({
			methodName : 'getFriendRequesterIds',
			data : accountId
		}, callback);
	});
	
	// 친구 요청을 거절합니다.
	inner.on('denyFriendRequest', (requesterId, callback) => {
		inner.sendToBackground({
			methodName : 'denyFriendRequest',
			data : requesterId
		}, callback);
	});
	
	// 친구 요청을 수락합니다.
	inner.on('acceptFriendRequest', (requesterId, callback) => {
		inner.sendToBackground({
			methodName : 'acceptFriendRequest',
			data : requesterId
		}, callback);
	});
	
	// 친구들의 ID를 가져옵니다.
	inner.on('getFriendIds', (accountId, callback) => {
		inner.sendToBackground({
			methodName : 'getFriendIds',
			data : accountId
		}, callback);
	});
	
	// 두 유저가 친구인지 확인합니다.
	inner.on('checkIsFriend', (params, callback) => {
		inner.sendToBackground({
			methodName : 'checkIsFriend',
			data : params
		}, callback);
	});
	
	// 친구를 삭제합니다.
	inner.on('removeFriend', (friendId, callback) => {
		inner.sendToBackground({
			methodName : 'removeFriend',
			data : friendId
		}, callback);
	});
	
	// 회원수 순으로 길드 ID들을 가져옵니다.
	inner.on('getGuildIdsByMemberCount', (notUsing, callback) => {
		inner.sendToBackground({
			methodName : 'getGuildIdsByMemberCount'
		}, callback);
	});
	
	// 특정 유저가 가입한 길드 ID를 가져옵니다.
	inner.on('getAccountGuildId', (accountId, callback) => {
		inner.sendToBackground({
			methodName : 'getAccountGuildId',
			data : accountId
		}, callback);
	});
	
	// 특정 길드 정보를 가져옵니다.
	inner.on('getGuild', (guildId, callback) => {
		inner.sendToBackground({
			methodName : 'getGuild',
			data : guildId
		}, callback);
	});
	
	// 이름으로 길드를 찾습니다.
	inner.on('findGuilds', (nameQuery, callback) => {
		inner.sendToBackground({
			methodName : 'findGuilds',
			data : nameQuery
		}, callback);
	});
	
	// 길드 가입 신청합니다.
	inner.on('requestGuildJoin', (targetGuildId, callback) => {
		inner.sendToBackground({
			methodName : 'requestGuildJoin',
			data : targetGuildId
		}, callback);
	});
	
	// 이미 길드 가입 신청했는지 확인합니다.
	inner.on('checkGuildJoinRequested', (params, callback) => {
		inner.sendToBackground({
			methodName : 'checkGuildJoinRequested',
			data : params
		}, callback);
	});
	
	// 길드 가입 신청자들의 ID를 가져옵니다.
	inner.on('getGuildJoinRequesterIds', (guildId, callback) => {
		inner.sendToBackground({
			methodName : 'getGuildJoinRequesterIds',
			data : guildId
		}, callback);
	});
	
	// 길드원들의 ID들을 가져옵니다.
	inner.on('getGuildMemberIds', (guildId, callback) => {
		inner.sendToBackground({
			methodName : 'getGuildMemberIds',
			data : guildId
		}, callback);
	});
	
	// 길드 가입 신청을 거절합니다.
	inner.on('denyGuildJoinRequest', (requesterId, callback) => {
		inner.sendToBackground({
			methodName : 'denyGuildJoinRequest',
			data : requesterId
		}, callback);
	});
	
	// 길드 가입 신청을 수락합니다.
	inner.on('acceptGuildJoinRequest', (requesterId, callback) => {
		inner.sendToBackground({
			methodName : 'acceptGuildJoinRequest',
			data : requesterId
		}, callback);
	});
	
	// 길드에서 탈퇴합니다.
	inner.on('leaveGuild', (notUsing, callback) => {
		inner.sendToBackground({
			methodName : 'leaveGuild'
		}, callback);
	});
	
	// 길드에서 내쫒습니다.
	inner.on('banGuildMember', (accountId, callback) => {
		inner.sendToBackground({
			methodName : 'banGuildMember',
			data : accountId
		}, callback);
	});
	
	const CLIENT_ID = UUID();
	
	// 대상에 참여합니다.
	inner.on('joinTarget', (target) => {
		inner.sendToBackground({
			methodName : 'joinTarget',
			data : {
				clientId : CLIENT_ID,
				target : target
			}
		});
	});
	
	// 대상에서 나옵니다.
	inner.on('exitTarget', (target) => {
		inner.sendToBackground({
			methodName : 'exitTarget',
			data : {
				clientId : CLIENT_ID,
				target : target
			}
		});
	});
	
	inner.on('getChatMessages', (target, callback) => {
		inner.sendToBackground({
			methodName : 'getChatMessages',
			data : target
		}, callback);
	});
	
	inner.on('sendChatMessage', (params) => {
		inner.sendToBackground({
			methodName : 'sendChatMessage',
			data : params
		});
	});
	
	inner.on('getPendingTransactions', (target, callback) => {
		inner.sendToBackground({
			methodName : 'getPendingTransactions',
			data : target
		}, callback);
	});
	
	inner.on('sendPendingTransaction', (params) => {
		inner.sendToBackground({
			methodName : 'sendPendingTransaction',
			data : params
		});
	});
	
	let eventPort = browser.runtime.connect({
		name : '__DSIDE_EVENT'
	});
	eventPort.postMessage(CLIENT_ID);
	eventPort.onMessage.addListener((params) => {
		inner.sendToPage(params);
	});
	
	return self;
})();