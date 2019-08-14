DPlayInventory.CheckData = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		if (DPlayInventory.SecureStore.existsPassword() !== true) {
			
			// 저장된 지갑 주소가 없다면
			if (DPlayInventory.SecureStore.existsWalletAddress() !== true) {
				DPlayInventory.GO('restoreaccount');
			}
			
			else {
				DPlayInventory.GO('login');
			}
		}
	}
});
