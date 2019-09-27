DPlayInventory.DPlayCoin = OBJECT({
	
	init : (inner, self) => {
		
		let getBalance = self.getBalance = (callback) => {
			//REQUIRED: callback
			
			DPlayInventory.Core.getAccountId((accountId) => {
				
				DPlayCoinContract.balanceOf(accountId, (balance) => {
					
					callback(balance);
				});
			});
		};
		
		const DECIMALS = 18;
		
		let getDisplayPrice = self.getDisplayPrice = (actualPrice) => {
			return +(actualPrice / Math.pow(10, DECIMALS)).toFixed(11);
		};
		
		let getActualPrice = self.getActualPrice = (displayPrice) => {
			return displayPrice * Math.pow(10, DECIMALS);
		};
	}
});