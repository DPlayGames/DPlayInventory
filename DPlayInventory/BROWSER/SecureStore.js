//!! 테스트용 보안 스토어
//!! 절대 이를 이용해 배포하면 안됩니다.
DPlayInventory.SecureStore = OBJECT({

	init : (inner, self) => {
		
		const NETWORK_ADDRESSES = {
			Mainnet : 'ws://175.207.29.151:8546',
			Ropsten : 'wss://ropsten.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
			Rinkeby : 'wss://rinkeby.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
			Kovan : 'wss://kovan.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
			Goerli : 'wss://goerli.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b'
		};
		
		let web3 = new Web3(NETWORK_ADDRESSES.Kovan);
		
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
			
			DPlayInventory.Crypto.encrypt({
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
			
			DPlayInventory.Crypto.decrypt({
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
			
			DPlayInventory.Crypto.encrypt({
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
			
			DPlayInventory.Crypto.decrypt({
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
					
					callback(web3.eth.accounts.sign(web3.utils.utf8ToHex(text), '0x' + privateKey).signature);
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