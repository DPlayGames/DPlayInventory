DPlayInventory.MAIN = METHOD({

	run : () => {
		
		DPlayInventory.MATCH_VIEW({
            uri : 'restoreaccount',
            target : DPlayInventory.RestoreAccount
        });
		
		DPlayInventory.MATCH_VIEW({
            uri : 'createaccount',
            target : DPlayInventory.CreateAccount
        });
		
		DPlayInventory.MATCH_VIEW({
            uri : 'login',
            target : DPlayInventory.Login
        });
		
		DPlayInventory.MATCH_VIEW({
            uri : '**',
            excludeURI : ['', 'restoreaccount', 'createaccount', 'login'],
            target : DPlayInventory.CheckData
        });
		
		DPlayInventory.MATCH_VIEW({
			uri : '**',
            excludeURI : ['restoreaccount', 'createaccount', 'login'],
			target : DPlayInventory.Layout
		});
		
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
