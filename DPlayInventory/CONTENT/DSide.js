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
	
	// 길드 목록을 가져옵니다.
	inner.on('getGuildList', (accountId, callback) => {
		inner.sendToBackground({
			methodName : 'getGuildList'
		}, callback);
	});
	
	// 특정 유저가 가입한 길드 정보를 가져옵니다.
	inner.on('getAccountGuild', (accountId, callback) => {
		inner.sendToBackground({
			methodName : 'getAccountGuild',
			data : accountId
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
	inner.on('checkGuildJoinRequested', (targetGuildId, callback) => {
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
	
	// 대상에 참여합니다.
	inner.on('joinTarget', (target) => {
		inner.sendToBackground({
			methodName : 'joinTarget',
			data : target
		});
	});
	
	// 대상에서 나옵니다.
	inner.on('exitTarget', (target) => {
		inner.sendToBackground({
			methodName : 'exitTarget',
			data : target
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
	
	return self;
})();