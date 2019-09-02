DPlayInventory.Ethereum = OBJECT({

	init : (inner, self) => {
		
		const NETWORK_ADDRESSES = {
			Mainnet : 'wss://mainnet.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
			Ropsten : 'wss://ropsten.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
			Rinkeby : 'wss://rinkeby.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
			Kovan : 'wss://kovan.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
			Goerli : 'wss://goerli.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b'
		};
		
		let web3 = new Web3(NETWORK_ADDRESSES.Mainnet);
		
		web3.eth.getBlockNumber(console.log);
		
		SmartContract.setWeb3(web3);
		
		let dplayCoinContract = DPlayInventory.DPlayCoinContract({
			address : '0xD3D2a9C0dA386D0d37573f7D06471DB81cfb3096'
		});
		
		let dplayStoreContract = DPlayInventory.DPlayStoreContract({
			address : '0xaa13eD0564DF5019E2DD5E09f03b5Abd31bC832D'
		});
		
		let getEtherBalance = self.getEtherBalance = (callbackOrHandlers) => {
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			let errorHandler;
			let callback;
			
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				errorHandler = callbackOrHandlers.error;
				callback = callbackOrHandlers.callback;
			}
			
			DPlayInventory.SecureStore.getAccountId((accountId) => {
				
				web3.eth.getBalance(accountId, (error, balance) => {
					
					if (error !== TO_DELETE) {
						if (errorHandler !== undefined) {
							errorHandler(error.toString());
						} else {
							SHOW_ERROR('DPlayInventory.Ethereum', error.toString());
						}
					}
					
					else {
						callback(balance);
					}
				});
				
				dplayCoinContract.balanceOf(accountId, (balance) => {
					console.log(dplayCoinContract.getDisplayPrice(balance));
				});
			});
		};
		
		let deploySmartContract = self.deploySmartContract = (params, callbackOrHandlers) => {
			//REQUIRED: params
			//REQUIRED: params.abi
			//REQUIRED: params.bytecode
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			let abi = params.abi;
			let bytecode = params.bytecode;
			
			let errorHandler;
			let callback;
			
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				errorHandler = callbackOrHandlers.error;
				callback = callbackOrHandlers.callback;
			}
			
			DPlayInventory.SecureStore.getAccountId((accountId) => {
				
				let deployData = new web3.eth.Contract(abi).deploy({
					data : bytecode
				}).encodeABI();
				
				DPlayInventory.SecureStore.signTransaction({
					from : accountId,
					data : deployData,
					gas : 2473896,
					gasPrice : 11000000000
				}, (rawTransaction) => {
					
					web3.eth.sendSignedTransaction(rawTransaction, (error, transactionHash) => {
						
						console.log(error, transactionHash);
					}).on('receipt', console.log);
				});
			});
		};
	}
});