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
			
			DPlayInventory.getAccountId((result) => {
				
				if (result.accountId !== undefined) {
					
					DPlayCoinContract.balanceOf(result.accountId, (balance) => {
						
						callback(balance);
					});
				}
			});
		});
	}
});