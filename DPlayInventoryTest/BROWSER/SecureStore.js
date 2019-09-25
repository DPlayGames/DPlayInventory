DPlayInventory.SecureStore = OBJECT({
	
	init : (inner, self) => {
		
		let testSessionStore = DPlayInventory.SESSION_STORE('__TEST_SESSION_STORE');
		let testSecureStore = DPlayInventory.STORE('__TEST_SECURE_STORE');
		
		let setPassword = self.setPassword = (password, callback) => {
			//REQUIRED: password
			//REQUIRED: callback
			
			testSessionStore.save({
				name : 'password',
				value : password
			});
			
			callback();
		};
		
		let checkPasswordExists = self.checkPasswordExists = (callback) => {
			//REQUIRED: callback
			
			callback(testSessionStore.get('password') !== undefined);
		};
		
		let removePassword = self.removePassword = (callback) => {
			//REQUIRED: callback
			
			testSessionStore.remove('password');
			callback();
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
			
			DPlayInventoryTest.Crypto.encrypt({
				text : accountId,
				password : testSessionStore.get('password')
			}, {
				error : errorHandler,
				success : (encryptedAccountId) => {
					
					testSecureStore.save({
						name : 'accountId',
						value : encryptedAccountId
					});
					
					callback();
				}
			});
		};
		
		let checkAccountIdExists = self.checkAccountIdExists = (callback) => {
			//REQUIRED: callback
			
			callback(testSecureStore.get('accountId') !== undefined);
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
			
			DPlayInventoryTest.Crypto.decrypt({
				encryptedText : testSecureStore.get('accountId'),
				password : testSessionStore.get('password')
			}, callbackOrHandlers);
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
			
			DPlayInventoryTest.Crypto.encrypt({
				text : privateKey,
				password : testSessionStore.get('password')
			}, {
				error : errorHandler,
				success : (encryptedAccountId) => {
					
					testSecureStore.save({
						name : 'privateKey',
						value : encryptedAccountId
					});
					
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
			
			DPlayInventoryTest.Crypto.decrypt({
				encryptedText : testSecureStore.get('privateKey'),
				password : testSessionStore.get('password')
			}, callbackOrHandlers);
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
			
			getPrivateKey({
				error : errorHandler,
				success : (privateKey) => {
					
					let prefixedMessage = ethereumjs.Util.sha3('\x19Ethereum Signed Message:\n' + text.length + text);
					let signedMessage = ethereumjs.Util.ecsign(prefixedMessage, ethereumjs.Util.toBuffer('0x' + privateKey));
					
					callback(ethereumjs.Util.toRpcSig(signedMessage.v, signedMessage.r, signedMessage.s).toString('hex'));
				}
			});
		};
		
		let signData = self.signData = (data, callbackOrHandlers) => {
			//REQUIRED: data
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			let sortedData = {};
			Object.keys(data).sort().forEach((key) => {
				sortedData[key] = data[key];
			});
			
			signText(STRINGIFY(sortedData), callbackOrHandlers);
		};
		
		let clear = self.clear = (callback) => {
			//REQUIRED: callback
			
			testSessionStore.clear();
			testSecureStore.clear();
			callback();
		};
	}
});