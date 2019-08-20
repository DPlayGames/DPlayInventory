RUN(() => {
	INIT_OBJECTS();
	
	const NETWORK_ADDRESSES = {
		Mainnet : 'ws://175.207.29.151:8546',
		Ropsten : 'wss://ropsten.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
		Rinkeby : 'wss://rinkeby.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
		Kovan : 'wss://kovan.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
		Goerli : 'wss://goerli.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b'
	};
	
	let web3 = new Web3(NETWORK_ADDRESSES.Kovan);
	
	let password;
	
	chrome.runtime.onMessage.addListener((params, sender, ret) => {
		
		let methodName = params.methodName;
		let data = params.data;
		
		// 비밀번호를 지정합니다.
		if (methodName === 'setPassword') {
			password = data;
			ret();
		}
		
		// 비밀번호가 존재하는지 확인합니다.
		if (methodName === 'checkPasswordExists') {
			ret(password !== undefined);
		}
		
		// 비밀번호를 삭제합니다.
		if (methodName === 'removePassword') {
			password = undefined;
			ret();
		}
		
		// 암호화합니다.
		let encrypt = (text, callback) => {
			
			Crypto.encrypt({
				text : text,
				password : password
			}, {
				error : (errorMsg) => {
					ret({
						errorMsg : errorMsg
					});
				},
				success : callback
			});
		};
		
		// 복호화합니다.
		let decrypt = (encryptedText, callback) => {
			
			Crypto.decrypt({
				encryptedText : encryptedText,
				password : password
			}, {
				error : (errorMsg) => {
					ret({
						errorMsg : errorMsg
					});
				},
				success : callback
			});
		};
		
		// 지갑 주소를 저장합니다.
		if (methodName === 'saveWalletAddress') {
			
			encrypt(data, (encryptedWalletAddress) => {
				
				chrome.storage.local.set({
					walletAddress : encryptedWalletAddress
				}, () => {
					ret({
						isDone : true
					});
				});
			});
			
			return true;
		}
		
		// 저장된 갑 주소가 존재하는지 확인합니다.
		if (methodName === 'checkWalletAddressExists') {
			
			chrome.storage.local.get(['walletAddress'], (result) => {
				ret(result.walletAddress !== undefined);
			});
			
			return true;
		}
		
		// 지갑 주소를 반환합니다.
		if (methodName === 'getWalletAddress') {
			
			chrome.storage.local.get(['walletAddress'], (result) => {
				
				decrypt(result.walletAddress, (walletAddress) => {
					
					ret({
						walletAddress : walletAddress
					});
				});
			});
			
			return true;
		}
		
		// 비밀키를 저장합니다.
		if (methodName === 'savePrivateKey') {
			
			encrypt(data, (encryptedPrivateKey) => {
				
				chrome.storage.local.set({
					privateKey : encryptedPrivateKey
				}, () => {
					ret({
						isDone : true
					});
				});
			});
			
			return true;
		}
		
		let getPrivateKey = (callback) => {
			
			chrome.storage.local.get(['privateKey'], (result) => {
				
				decrypt(result.privateKey, callback);
			});
		};
		
		// 비밀키를 반환합니다.
		if (methodName === 'getPrivateKey') {
			
			getPrivateKey((privateKey) => {
				
				ret({
					privateKey : privateKey
				});
			});
			
			return true;
		}
		
		// 트랜잭션에 서명합니다.
		if (methodName === 'signTransaction') {
			
			getPrivateKey((privateKey) => {
				
				console.log(privateKey);
				
				web3.eth.accounts.signTransaction(data, '0x' + privateKey, (error, result) => {
					
					if (error !== TO_DELETE) {
						ret({
							errorMsg : error.toString()
						});
					}
					
					else {
						ret({
							rawTransaction : result.rawTransaction
						});
					}
				});
			});
			
			return true;
		}
		
		// 문자열에 서명합니다.
		if (methodName === 'sign') {
			
			getPrivateKey((privateKey) => {
				
				ret({
					signature : web3.eth.accounts.sign(data, '0x' + privateKey).signature
				});
			});
			
			return true;
		}
		
		// 초기화합니다.
		if (methodName === 'clear') {
			
			password = undefined;
			
			chrome.storage.local.clear(() => {
				ret({
					isDone : true
				});
			});
			
			return true;
		}
	});
});