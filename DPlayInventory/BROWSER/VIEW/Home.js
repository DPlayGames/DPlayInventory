DPlayInventory.Home = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let web3 = new Web3('ws://175.207.29.151:8546');
		
		let content = DIV({
			c : ['test']
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inner.on('close', () => {
			content.remove();
		});
	}
});