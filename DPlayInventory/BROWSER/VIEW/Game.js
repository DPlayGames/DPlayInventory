DPlayInventory.Game = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let inventoryStore = DPlayInventory.STORE('inventoryStore');
		
		let webGameList;
		let content = DIV({
			c : [H3({
				c : MSG('GAME_LIST_TITLE')
			}), MSG('EMPTY_GAME_LIST_MESSAGE'), H3({
				c : MSG('WEB_GAME_LIST_TITLE')
			}), webGameList = DIV({
				c : MSG('EMPTY_WEB_GAME_LIST_MESSAGE')
			})]
		});
		
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