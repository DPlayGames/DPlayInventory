//!! 테스트용 암호화 유틸리티
//!! 절대 이를 이용해 배포하면 안됩니다.
DPlayInventory.Encryption = OBJECT({

	init : (inner, self) => {
		
		let testSessionStore = DPlayInventory.SESSION_STORE('__TEST_SESSION_STORE');
		
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
		
		let encrypt = self.encrypt = (text, callbackOrHandlers) => {
			//REQUIRED: text
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			DPlayInventory.Crypto.encrypt({
				text : text,
				password : testSessionStore.get('password')
			}, callbackOrHandlers);
		};
		
		let decrypt = self.decrypt = (encryptedText, callbackOrHandlers) => {
			//REQUIRED: encryptedText
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			DPlayInventory.Crypto.decrypt({
				encryptedText : encryptedText,
				password : testSessionStore.get('password')
			}, callbackOrHandlers);
		};
	}
});