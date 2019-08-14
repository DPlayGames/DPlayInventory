DPlayInventory.Game = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let inventoryStore = DPlayInventory.STORE('inventoryStore');
		
		let content = DIV({
			c : ['game']
		});
		
		DPlayInventory.Layout.turnOnGameTab();
		DPlayInventory.Layout.setContent(content);
		
		inventoryStore.save({
			name : 'lastTab',
			value : 'game'
		});
		
		inner.on('close', () => {
			content.remove();
		});
	}
});