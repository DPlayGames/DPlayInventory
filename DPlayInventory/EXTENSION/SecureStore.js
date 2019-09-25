DPlayInventory.SecureStore = OBJECT({
	
	preset : () => {
		return Connector;
	},
	
	params : () => {
		return 'SecureStore';
	},
	
	init : (inner, self) => {
		
		let setPassword = self.setPassword = (password, callback) => {
			//REQUIRED: password
			//REQUIRED: callback
			
			inner.send({
				methodName : 'setPassword',
				data : password
			}, callback);
		};
		
		let checkPasswordExists = self.checkPasswordExists = (callback) => {
			//REQUIRED: callback
			
			inner.send({
				methodName : 'checkPasswordExists'
			}, callback);
		};
		
		let removePassword = self.removePassword = (callback) => {
			//REQUIRED: callback
			
			inner.send({
				methodName : 'removePassword'
			}, callback);
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
			
			inner.send({
				methodName : 'saveAccountId',
				data : accountId
			}, (result) => {
				
				if (result.errorMsg !== undefined) {
					if (errorHandler !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						SHOW_ERROR('DPlayInventory.SecureStore', result.errorMsg);
					}
				}
				
				else {
					callback();
				}
			});
		};
		
		let checkAccountIdExists = self.checkAccountIdExists = (callback) => {
			//REQUIRED: callback
			
			inner.send({
				methodName : 'checkAccountIdExists'
			}, callback);
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
			
			inner.send({
				methodName : 'getAccountId',
			}, (result) => {
				
				if (result.errorMsg !== undefined) {
					if (errorHandler !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						SHOW_ERROR('DPlayInventory.SecureStore', result.errorMsg);
					}
				}
				
				else {
					callback(result.accountId);
				}
			});
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
			
			inner.send({
				methodName : 'savePrivateKey',
				data : privateKey
			}, (result) => {
				
				if (result.errorMsg !== undefined) {
					if (errorHandler !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						SHOW_ERROR('DPlayInventory.SecureStore', result.errorMsg);
					}
				}
				
				else {
					callback();
				}
			});
		};
		
		let getPrivateKey = self.getPrivateKey = (callbackOrHandlers) => {
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
			
			inner.send({
				methodName : 'getPrivateKey'
			}, (result) => {
				
				if (result.errorMsg !== undefined) {
					if (errorHandler !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						SHOW_ERROR('DPlayInventory.SecureStore', result.errorMsg);
					}
				}
				
				else {
					callback(result.privateKey);
				}
			});
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
			
			inner.send({
				methodName : 'sign',
				data : text
			}, (result) => {
				
				if (result.errorMsg !== undefined) {
					if (errorHandler !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						SHOW_ERROR('DPlayInventory.SecureStore', result.errorMsg);
					}
				}
				
				else {
					callback(result.signature);
				}
			});
		};
		
		let clear = self.clear = (callback) => {
			//REQUIRED: callback
			
			inner.send({
				methodName : 'clear'
			}, callback);
		};
	}
});