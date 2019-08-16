RUN(() => {
	INIT_OBJECTS();
	
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
		if (methodName === 'encrypt') {
			
			Crypto.encrypt({
				text : data,
				password : password
			}, {
				error : (errorMsg) => {
					ret({
						errorMsg : errorMsg
					});
				},
				success : (encryptedWalletAddress) => {
					ret({
						encryptedText : encryptedText
					});
				}
			});
			
			return true;
		}
		
		// 복호화합니다.
		if (methodName === 'decrypt') {
			
			Crypto.decrypt({
				encryptedText : data,
				password : password
			}, {
				error : (errorMsg) => {
					ret({
						errorMsg : errorMsg
					});
				},
				success : (text) => {
					ret({
						text : text
					});
				}
			});
			
			return true;
		}
	});
});