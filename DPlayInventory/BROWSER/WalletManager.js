DPlayInventory.WalletManager = OBJECT({

	init : (inner, self) => {
		
		let checkExistsWalletAddress = self.checkExistsWalletAddress = (callback) => {
			//REQUIRED: callback
			
			DPlayInventory.SecureStore.get('walletAddress', (encryptedWalletAddress) => {
				callback(encryptedWalletAddress !== undefined);
			});
		};
		
		let saveWalletAddress = self.saveWalletAddress = (walletAddress, callback) => {
			//REQUIRED: walletAddress
			//REQUIRED: callback
			
			DPlayInventory.SecureStore.save({
				name : 'walletAddress',
				value : walletAddress
			}, callback);
		};
		
		let getWalletAddress = self.getWalletAddress = (callback) => {
			//REQUIRED: callback
			
			DPlayInventory.SecureStore.get('walletAddress', callback);
		};
		
		let savePrivateKey = self.savePrivateKey = (params, callbackOrHandlers) => {
			//REQUIRED: params
			//REQUIRED: params.privateKey
			//REQUIRED: params.password
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			let privateKey = params.privateKey;
			let password = params.password;
			
			let errorHandler;
			let callback;
			
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				errorHandler = callbackOrHandlers.error;
				callback = callbackOrHandlers.callback;
			}
			
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
		};
		
		let getPrivateKey = self.getPrivateKey = (password, callbackOrHandlers) => {
			//REQUIRED: password
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			DPlayInventory.SecureStore.get('privateKey', (encryptedPrivateKey) => {
				
				DPlayInventory.Crypto.decrypt({
					encryptedText : encryptedPrivateKey,
					password : password
				}, callbackOrHandlers);
			});
		};
		
		let clear = self.clear = (callback) => {
			//REQUIRED: callback
			
			DPlayInventory.SecureStore.clear(callback);
		};
	}
});