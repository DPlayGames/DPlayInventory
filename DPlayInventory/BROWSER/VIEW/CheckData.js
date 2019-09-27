DPlayInventory.CheckData = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		DPlayInventory.Core.checkAccountIdExists((accountIdExists) => {
			
			// 저장된 계정 ID가 없다면
			if (accountIdExists !== true) {
				DPlayInventory.GO('restoreaccount');
			}
			
			else {
				
				DPlayInventory.Core.checkPasswordExists((passwordExists) => {
					
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
