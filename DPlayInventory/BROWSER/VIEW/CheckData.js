DPlayInventory.CheckData = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		DPlayInventory.WalletManager.checkExistsWalletAddress((existsWalletAddress) => {
			
			// 저장된 지갑 주소가 없다면
			if (existsWalletAddress !== true) {
				DPlayInventory.GO('restoreaccount');
			}
		});
	}
});
