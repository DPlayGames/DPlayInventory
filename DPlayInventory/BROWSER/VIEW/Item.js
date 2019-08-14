DPlayInventory.Item = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let inventoryStore = DPlayInventory.STORE('inventoryStore');
		
		let content = DIV({
			c : ['item']
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inventoryStore.save({
			name : 'lastTab',
			value : 'item'
		});
		
		inner.on('close', () => {
			content.remove();
		});
	}
});