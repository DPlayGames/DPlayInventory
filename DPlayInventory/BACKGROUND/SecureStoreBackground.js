global.SecureStoreBackground = OBJECT({

	preset : () => {
		return WebExtensionBackground;
	},
	
	params : () => {
		return {
			backgroundName : 'SecureStoreBackground'
		};
	},

	init : (inner, self) => {
		
		let password;
		
		// 비밀번호를 지정합니다.
		inner.on('setPassword', (_password, callback) => {
			password = _password;
			callback();
		});
		
		// 비밀번호가 존재하는지 확인합니다.
		inner.on('checkPasswordExists', (notUsing, callback) => {
			callback(password !== undefined);
		});
		
		// 비밀번호를 삭제합니다.
		inner.on('removePassword', (notUsing, callback) => {
			password = undefined;
			callback();
		});
		
		// 지갑 주소를 저장합니다.
		inner.on('saveWalletAddress', (walletAddress, callback) => {
			
			Crypto.encrypt({
				text : walletAddress,
				password : password
			}, {
				error : (errorMsg) => {
					callback({
						errorMsg : errorMsg
					});
				},
				success : (encryptedWalletAddress) => {
					
					chrome.storage.local.set({
						walletAddress : encryptedWalletAddress
					}, () => {
						callback({
							isDone : true
						});
					});
				}
			});
		});
		
		// 저장된 갑 주소가 존재하는지 확인합니다.
		inner.on('checkWalletAddressExists', (notUsing, callback) => {
			
			chrome.storage.local.get(['walletAddress'], (result) => {
				callback(result.walletAddress !== undefined);
			});
		});
		
		// 지갑 주소를 반환합니다.
		inner.on('getWalletAddress', (notUsing, callback) => {
			
			chrome.storage.local.get(['walletAddress'], (result) => {
				
				Crypto.decrypt({
					encryptedText : result.walletAddress,
					password : password
				}, {
					error : (errorMsg) => {
						callback({
							errorMsg : errorMsg
						});
					},
					success : (walletAddress) => {
						
						callback({
							walletAddress : walletAddress
						});
					}
				});
			});
		});
		
		// 비밀키를 저장합니다.
		inner.on('savePrivateKey', (privateKey, callback) => {
			
			Crypto.encrypt({
				text : privateKey,
				password : password
			}, {
				error : (errorMsg) => {
					callback({
						errorMsg : errorMsg
					});
				},
				success : (encryptedPrivateKey) => {
					
					chrome.storage.local.set({
						privateKey : encryptedPrivateKey
					}, () => {
						callback({
							isDone : true
						});
					});
				}
			});
		});
		
		let getPrivateKey = (ret, callback) => {
			
			chrome.storage.local.get(['privateKey'], (result) => {
				
				Crypto.decrypt({
					encryptedText : result.privateKey,
					password : password
				}, {
					error : (errorMsg) => {
						ret({
							errorMsg : errorMsg
						});
					},
					success : callback
				});
			});
		};
		
		// 트랜잭션에 서명합니다.
		inner.on('signTransaction', (transactionData, callback) => {
			
			getPrivateKey(callback, (privateKey) => {
				
				web3.eth.accounts.signTransaction(transactionData, '0x' + privateKey, (error, result) => {
					
					if (error !== TO_DELETE) {
						callback({
							errorMsg : error.toString()
						});
					}
					
					else {
						callback({
							rawTransaction : result.rawTransaction
						});
					}
				});
			});
		});
		
		// 문자열에 서명합니다.
		inner.on('sign', (transactionData, callback) => {
			
			getPrivateKey(callback, (privateKey) => {
				
				callback({
					signature : web3.eth.accounts.sign(data, '0x' + privateKey).signature
				});
			});
		});
		
		// 초기화합니다.
		inner.on('clear', (notUsing, callback) => {
			
			password = undefined;
			
			chrome.storage.local.clear(() => {
				
				callback();
			});
		});
	}
});