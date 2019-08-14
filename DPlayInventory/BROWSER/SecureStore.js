//!! 테스트용 보안 스토어
//!! 절대 이를 이용해 배포하면 안됩니다.
DPlayInventory.SecureStore = OBJECT({

	init : (inner, self) => {
		
		let testSecureStore = DPlayInventory.STORE('__TEST_SECURE_STORE');
		
		let save = self.save = (params, callback) => {
			//REQUIRED: params
			//REQUIRED: params.name
			//REQUIRED: params.value
			//REQUIRED: callback
			
			testSecureStore.save({
				name : params.name,
				value : params.value
			});
			
			callback();
		};
		
		let get = self.get = (name, callback) => {
			//REQUIRED: name
			//REQUIRED: callback
			
			callback(testSecureStore.get(name));
		};
		
		let clear = self.clear = (callback) => {
			//REQUIRED: callback
			
			testSecureStore.clear();
			callback();
		};
	}
});