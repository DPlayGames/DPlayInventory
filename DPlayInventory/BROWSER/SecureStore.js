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
			
			DPlayInventory.Crypto.encrypt({
				text : walletAddress,
				password : testSessionStore.get('password')
			}, {
				error : errorHandler,
				success : (encryptedWalletAddress) => {
					
					testSecureStore.save({
						name : 'walletAddress',
						value : encryptedWalletAddress
					});
					
					callback();
				}
			});
		};
		
		let checkWalletAddressExists = self.checkWalletAddressExists = (callback) => {
			//REQUIRED: callback
			
			callback(testSecureStore.get('walletAddress') !== undefined);
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
			
			DPlayInventory.Crypto.decrypt({
				encryptedText : testSecureStore.get('walletAddress'),
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
				success : (encryptedWalletAddress) => {
					
					testSecureStore.save({
						name : 'privateKey',
						value : encryptedWalletAddress
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
			
			getPrivateKey({
				error : errorHandler,
				success : (privateKey) => {
					
					web3.eth.accounts.signTransaction(transactionData, '0x' + privateKey, (error, result) => {
						
						if (error !== TO_DELETE) {
							if (errorHandler !== undefined) {
								errorHandler(error.toString());
							} else {
								SHOW_ERROR('DPlayInventory.SecureStore', error.toString());
							}
						}
						
						else {
							callback(result.rawTransaction);
						}
					});
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
			
			getPrivateKey({
				error : errorHandler,
				success : (privateKey) => {
					
					callback(web3.eth.accounts.sign(text, '0x' + privateKey).signature);
				}
			});
		};
		
		let clear = self.clear = (callback) => {
			//REQUIRED: callback
			
			testSessionStore.clear();
			testSecureStore.clear();
			callback();
		};
	}
});