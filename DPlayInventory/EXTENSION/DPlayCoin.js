DPlayInventory.DPlayCoin = OBJECT({
	
	preset : () => {
		return Connector;
	},
	
	params : () => {
		return 'DPlayCoin';
	},
	
	init : (inner, self) => {
		
		let getBalance = self.getBalance = (callback) => {
			//REQUIRED: callback
			
			inner.send({
				methodName : 'getBalance'
			}, callback);
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