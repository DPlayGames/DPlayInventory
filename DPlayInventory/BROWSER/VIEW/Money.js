DPlayInventory.Money = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let inventoryStore = DPlayInventory.STORE('inventoryStore');
		
		let dPanel;
		let content = DIV({
			c : ['money', dPanel = DIV()]
		});
		
		DPlayInventory.SecureStore.getAccountId((accountId) => {
			
			DPlayInventory.DSide.getDBalance(accountId, (dBalance) => {
				dPanel.append('d: ' + dBalance);
			});
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