DPlayInventory.CheckData = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		DPlayInventory.SecureStore.checkAccountIdExists((accountIdExists) => {
			
			// 저장된 계정 ID가 없다면
			if (accountIdExists !== true) {
				DPlayInventory.GO('restoreaccount');
			}
			
			else {
				
				DPlayInventory.SecureStore.checkPasswordExists((passwordExists) => {
					
					if (passwordExists !== true) {
						DPlayInventory.GO('login');
					}
					
					// DSide에 로그인
					else {
						DPlayInventory.DSide.login();
					}
				});
			}
		});
	}
});
