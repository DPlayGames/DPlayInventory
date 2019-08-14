DPlayInventory.WalletManager = OBJECT({

	init : (inner, self) => {
		
		let password;
		
		let setPassword = self.setPassword = (_password) => {
			//REQUIRED: password
			
			password = _password;
		};
		
		let checkExistsPassword = self.checkExistsPassword = () => {
			return password !== undefined;
		};
		
		let removePassword = self.removePassword = () => {
			password = undefined;
		};
		
		let checkPassword = (callback) => {
			if (password === undefined) {
				throw new Error('비밀번호가 입력되지 않았습니다.');
			} else {
				callback();
			}
		};
		
		let checkExistsWalletAddress = self.checkExistsWalletAddress = (callback) => {
			//REQUIRED: callback
			
			DPlayInventory.SecureStore.get('walletAddress', (encryptedWalletAddress) => {
				callback(encryptedWalletAddress !== undefined);
			});
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
				callback = callbackOrHandlers.callback;
			}
			
			checkPassword(() => {
				
				DPlayInventory.Crypto.encrypt({
					text : walletAddress,
					password : password
				}, {
					error : errorHandler,
					success : (encryptedWalletAddress) => {
						
						DPlayInventory.SecureStore.save({
							name : 'walletAddress',
							value : encryptedWalletAddress
						}, callback);
					}
				});
			});
		};
		
		let getWalletAddress = self.getWalletAddress = (callbackOrHandlers) => {
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			checkPassword(() => {
				
				DPlayInventory.SecureStore.get('walletAddress', (encryptedWalletAddress) => {
					
					DPlayInventory.Crypto.decrypt({
						encryptedText : encryptedWalletAddress,
						password : password
					}, callbackOrHandlers);
				});
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
				callback = callbackOrHandlers.callback;
			}
			
			checkPassword(() => {
				
				DPlayInventory.Crypto.encrypt({
					text : privateKey,
					password : password
				}, {
					error : errorHandler,
					success : (encryptedPrivateKey) => {
						
						DPlayInventory.SecureStore.save({
							name : 'privateKey',
							value : encryptedPrivateKey
						}, callback);
					}
				});
			});
		};
		
		let getPrivateKey = self.getPrivateKey = (callbackOrHandlers) => {
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			checkPassword(() => {
				
				DPlayInventory.SecureStore.get('privateKey', (encryptedPrivateKey) => {
					
					DPlayInventory.Crypto.decrypt({
						encryptedText : encryptedPrivateKey,
						password : password
					}, callbackOrHandlers);
				});
			});
		};
		
		let clear = self.clear = (callback) => {
			//REQUIRED: callback
			
			DPlayInventory.SecureStore.clear(callback);
		};
	}
});