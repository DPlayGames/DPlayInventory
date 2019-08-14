DPlayInventory.MAIN = METHOD({

	run : () => {
		
		DPlayInventory.MATCH_VIEW({
			uri : '',
			target : DPlayInventory.Home
		});
		
		DPlayInventory.MATCH_VIEW({
			uri : 'account',
			target : DPlayInventory.Account
		});
		
		DPlayInventory.MATCH_VIEW({
			uri : 'game',
			target : DPlayInventory.Game
		});
		
		DPlayInventory.MATCH_VIEW({
			uri : 'money',
			target : DPlayInventory.Money
		});
		
		DPlayInventory.MATCH_VIEW({
			uri : 'item',
			target : DPlayInventory.Item
		});
	}
});
