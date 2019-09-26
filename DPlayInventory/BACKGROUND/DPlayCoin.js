global.DPlayCoin = OBJECT({

	preset : () => {
		return Connector;
	},
	
	params : () => {
		return 'DPlayCoin';
	},

	init : (inner, self) => {
		
		inner.on('getBalance', (notUsing, callback) => {
			
			SecureStore.getAccountId((result) => {
				
				if (result.accountId !== undefined) {
					
					DPlayCoinContract.balanceOf(result.accountId, (balance) => {
						
						callback(balance);
					});
				}
			});
		});
	}
});