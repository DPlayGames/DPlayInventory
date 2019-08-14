// 테스트용 보안 스토어
// 절대 이를 이용해 배포하면 안됩니다.
DPlayInventory.SecureStore = OBJECT({

	init : (inner, self) => {
		
		let password;
		
		let setPassword = self.setPassword = (_password) => {
			//REQUIRED: password
			
			password = _password;
		};
		
		let existsPassword = self.existsPassword = () => {
			return password !== undefined;
		};
		
		let testSecureStore = DPlayInventory.STORE('__TEST_SECURE_STORE');
		
		let existsWalletAddress = self.existsWalletAddress = () => {
			return testSecureStore.get('walletAddress') !== undefined;
		};
		
		let saveWalletAddress = self.saveWalletAddress = (walletAddress) => {
			//REQUIRED: walletAddress
			
			testSecureStore.save({
				name : 'walletAddress',
				value : walletAddress
			});
		};
		
		let getWalletAddress = self.getWalletAddress = () => {
			return testSecureStore.get('walletAddress');
		};
		
		let savePrivateKey = self.savePrivateKey = (privateKey) => {
			//REQUIRED: privateKey
			
			testSecureStore.save({
				name : 'privateKey',
				value : privateKey
			});
		};
		
		let getPrivateKey = self.getPrivateKey = () => {
			return testSecureStore.get('privateKey');
		};
		
		let clear = self.clear = () => {
			testSecureStore.clear();
		};
	}
});