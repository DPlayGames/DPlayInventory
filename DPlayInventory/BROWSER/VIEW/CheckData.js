DPlayInventory.CheckData = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		DPlayInventory.WalletManager.checkWalletAddressExists((walletAddressExists) => {
			
			// 저장된 지갑 주소가 없다면
			if (walletAddressExists !== true) {
				DPlayInventory.GO('restoreaccount');
			}
			
			else {
				
				DPlayInventory.Encryption.checkPasswordExists((passwordExists) => {
					
					if (passwordExists !== true) {
						DPlayInventory.GO('login');
					}
				});
			}
		});
	}
});
