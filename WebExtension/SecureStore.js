OVERRIDE(DPlayInventory.SecureStore, (origin) => {
	
	DPlayInventory.SecureStore = OBJECT({
		
		preset : () => {
			return WebExtensionForeground;
		},
		
		params : () => {
			return {
				backgroundName : 'SecureStoreBackground'
			};
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
			
			let saveWalletAddress = self.saveWalletAddress = (walletAddress, callbackOrHandlers) => {
				//REQUIRED: walletAddress
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
					methodName : 'saveWalletAddress',
					data : walletAddress
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
			
			let checkWalletAddressExists = self.checkWalletAddressExists = (callback) => {
				//REQUIRED: callback
				
				inner.send({
					methodName : 'checkWalletAddressExists'
				}, callback);
			};
			
			let getWalletAddress = self.getWalletAddress = (callbackOrHandlers) => {
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
					methodName : 'getWalletAddress',
				}, (result) => {
					
					if (result.errorMsg !== undefined) {
						if (errorHandler !== undefined) {
							errorHandler(result.errorMsg);
						} else {
							SHOW_ERROR('DPlayInventory.SecureStore', result.errorMsg);
						}
					}
					
					else {
						callback(result.walletAddress);
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
			
			let signTransaction = self.signTransaction = (transactionData, callbackOrHandlers) => {
				//REQUIRED: transactionData
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
					methodName : 'signTransaction',
					data : transactionData
				}, (result) => {
					
					if (result.errorMsg !== undefined) {
						if (errorHandler !== undefined) {
							errorHandler(result.errorMsg);
						} else {
							SHOW_ERROR('DPlayInventory.SecureStore', result.errorMsg);
						}
					}
					
					else {
						callback(result.rawTransaction);
					}
				});
			};
			
			let sign = self.sign = (text, callbackOrHandlers) => {
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
});