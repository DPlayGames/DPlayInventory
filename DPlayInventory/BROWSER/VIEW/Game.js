DPlayInventory.Game = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let inventoryStore = DPlayInventory.STORE('inventoryStore');
		
		let webGameList;
		let content = DIV({
			c : ['구매하신 게임이 없습니다.', H3({
				c : '웹 게임 목록'
			}), webGameList = DIV({
				c : '아직 웹 게임이 없습니다.'
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