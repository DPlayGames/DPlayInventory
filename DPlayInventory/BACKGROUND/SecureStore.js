global.SecureStore = OBJECT({

	preset : () => {
		return Connector;
	},
	
	params : () => {
		return 'SecureStore';
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
		
		// 계정 ID를 저장합니다.
		inner.on('saveAccountId', (accountId, callback) => {
			
			Crypto.encrypt({
				text : accountId,
				password : password
			}, {
				error : (errorMsg) => {
					callback({
						errorMsg : errorMsg
					});
				},
				success : (encryptedAccountId) => {
					
					chrome.storage.local.set({
						accountId : encryptedAccountId
					}, () => {
						callback({
							isDone : true
						});
					});
				}
			});
		});
		
		// 저장된 갑 주소가 존재하는지 확인합니다.
		inner.on('checkAccountIdExists', (notUsing, callback) => {
			
			chrome.storage.local.get(['accountId'], (result) => {
				callback(result.accountId !== undefined);
			});
		});
		
		let getAccountId = self.getAccountId = (callback) => {
			
			chrome.storage.local.get(['accountId'], (result) => {
				
				Crypto.decrypt({
					encryptedText : result.accountId,
					password : password
				}, {
					error : (errorMsg) => {
						callback({
							errorMsg : errorMsg
						});
					},
					success : (accountId) => {
						callback({
							accountId : accountId
						});
					}
				});
			});
		};
		
		// 계정 ID를 반환합니다.
		inner.on('getAccountId', (notUsing, callback) => {
			getAccountId(callback);
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
		
		let signText = self.signText = (data, callback) => {
			
			getPrivateKey(callback, (privateKey) => {
				
				let i, length, c;
				for(length = i = 0; c = text.charCodeAt(i++); length += c >> 11 ? 3 : c >> 7 ? 2 : 1);
				
				let prefixedMessage = ethereumjs.Util.sha3('\x19Ethereum Signed Message:\n' + length + text);
				let signedMessage = ethereumjs.Util.ecsign(prefixedMessage, ethereumjs.Util.toBuffer('0x' + privateKey));
				
				callback(ethereumjs.Util.toRpcSig(signedMessage.v, signedMessage.r, signedMessage.s).toString('hex'));
			});
		};
		
		// 문자열에 서명합니다.
		inner.on('signText', (data, callback) => {
			
			signText(data, (signature) => {
				
				callback({
					signature : signature
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