DPlayInventory.Money = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let inventoryStore = DPlayInventory.STORE('inventoryStore');
		
		let content = DIV({
			c : ['money']
		});
		
		DPlayInventory.Layout.turnOnMoneyTab();
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