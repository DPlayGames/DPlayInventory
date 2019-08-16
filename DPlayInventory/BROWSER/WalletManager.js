DPlayInventory.WalletManager = OBJECT({

	init : (inner, self) => {
		
		let checkPassword = (callback) => {
			
			DPlayInventory.Encryption.checkPasswordExists((passwordExists) => {
				
				if (passwordExists !== true) {
					SHOW_ERROR('DPlayInventory.WalletManager', '비밀번호가 입력되지 않았습니다.');
				} else {
					callback();
				}
			});
		};
		
		let checkWalletAddressExists = self.checkWalletAddressExists = (callback) => {
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
				
				DPlayInventory.Encryption.encrypt(walletAddress, {
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
					
					DPlayInventory.Encryption.decrypt(encryptedWalletAddress, callbackOrHandlers);
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
				
				DPlayInventory.Encryption.encrypt(privateKey, {
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
					
					DPlayInventory.Encryption.decrypt(encryptedPrivateKey, callbackOrHandlers);
				});
			});
		};
		
		let clear = self.clear = (callback) => {
			//REQUIRED: callback
			
			DPlayInventory.SecureStore.clear(callback);
		};
	}
});