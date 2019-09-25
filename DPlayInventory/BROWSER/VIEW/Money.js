DPlayInventory.Money = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let inventoryStore = DPlayInventory.STORE('inventoryStore');
		
		let dcPanel;
		let dPanel;
		let etherPanel;
		
		let content = DIV({
			c : ['money', dcPanel = DIV({
				c : 'DC: ...'
			}), dPanel = DIV({
				c : 'd: ...'
			}), etherPanel = DIV({
				c : 'Ether: ...'
			})]
		});
		
		DPlayInventory.DPlayCoin.getBalance((balance) => {
			dcPanel.empty();
			dcPanel.append('DC: ' + DPlayInventory.DPlayCoin.getDisplayPrice(balance));
		});
		
		DPlayInventory.DSide.getDBalance((balance) => {
			dPanel.empty();
			dPanel.append('d: ' + balance);
		});
		
		DPlayInventory.Ethereum.getEtherBalance((balance) => {
			etherPanel.empty();
			etherPanel.append('Ether: ' + DPlayInventory.Ethereum.getDisplayPrice(balance));
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inventoryStore.save({
			name : 'lastTab',
			value : 'money'
		});
		
		inner.on('close', () => {
			content.remove();
		});
	}
});