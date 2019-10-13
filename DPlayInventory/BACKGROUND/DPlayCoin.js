global.DPlayCoin = OBJECT({
	
	init : (inner, self) => {
		
		Connector('DPlayCoin', (on, off, send) => {
			
			on('getBalance', (notUsing, callback) => {
				
				DPlayInventory.getAccountId((accountId) => {
					
					if (accountId !== undefined) {
						
						DPlayCoinContract.balanceOf(accountId, (balance) => {
							
							callback(balance);
						});
					}
				});
			});
		});
	}
});