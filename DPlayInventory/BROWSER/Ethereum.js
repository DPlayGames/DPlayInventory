DPlayInventory.Ethereum = OBJECT({

	init : (inner, self) => {
		
		let web3 = new Web3('ws://175.207.29.151:8546');
		
		let getEtherBalance = self.getEtherBalance = (callback) => {
			//REQUIRED: callback
			
			DPlayInventory.WalletManager.getWalletAddress((walletAddress) => {
				
				web3.eth.getBalance(walletAddress, (error, balance) => {
					console.log(walletAddress, balance);
				});
				
				web3.eth.net.getId(console.log);
				
				web3.eth.getBlockNumber(console.log)
			});
		};
	}
});