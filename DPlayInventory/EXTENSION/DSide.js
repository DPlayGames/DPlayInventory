DPlayInventory.DSide = OBJECT({
	
	preset : () => {
		return Connector;
	},
	
	params : () => {
		return 'DSide';
	},
	
	init : (inner, self) => {
		
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
		
		// 특정 계정의 d 잔고를 가져옵니다.
		let getDBalance = self.getDBalance = (callback) => {
			//REQUIRED: callback
			
			inner.send({
				methodName : 'getDBalance'
			}, callback);
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
			
			inner.send({
				methodName : 'saveAccountDetail',
				data : params
			}, seperateHandler(callbackOrHandlers));
		};
		
		// 계정 상세 정보를 가져옵니다.
		let getAccountDetail = self.getAccountDetail = (accountId, callback) => {
			//REQUIRED: accountId
			//REQUIRED: callback
			
			inner.send({
				methodName : 'getAccountDetail',
				data : accountId
			}, callback);
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
			//REQUIRED: params.data.memberIds
			//REQUIRED: params.data.createTime
			
			inner.send({
				methodName : 'createGuild',
				data : params
			}, callback);
		};
		
		// 길드의 해시를 가져옵니다.
		let getGuildHash = self.getGuildHash = (guildId, callback) => {
			//REQUIRED: guildId
			//REQUIRED: callback
			
			inner.send({
				methodName : 'getGuildHash',
				data : guildId
			}, callback);
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
			//REQUIRED: params.data.memberIds
			//REQUIRED: params.data.createTime
			//REQUIRED: params.data.lastUpdateTime
			
			inner.send({
				methodName : 'updateGuild',
				data : params
			}, callback);
		};
		
		// 특정 계정이 가입한 길드 정보를 가져옵니다.
		let getAccountGuild = self.getAccountGuild = (accountId, callback) => {
			//REQUIRED: accountId
			//REQUIRED: callback
			
			inner.send({
				methodName : 'getAccountGuild',
				data : accountId
			}, callback);
		};
		
		let login = self.login = (callback) => {
			//REQUIRED: callback
			
			inner.send({
				methodName : 'login'
			}, callback);
		};
	}
});