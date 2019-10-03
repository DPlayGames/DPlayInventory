global.DPlayCoin = OBJECT({

	preset : () => {
		return Connector;
	},
	
	params : () => {
		return {
			pack : 'DPlayCoin'
		};
	},

	init : (inner, self) => {
		
		inner.on('getBalance', (notUsing, callback) => {
			
			DPlayInventory.getAccountId((accountId) => {
				
				if (accountId !== undefined) {
					
					DPlayCoinContract.balanceOf(accountId, (balance) => {
						
						callback(balance);
					});
				}
			});
		});
	}
});