DPlayInventory.MAIN = METHOD({

	run : () => {
		
		// 크롬에서는 browser 객체가 없습니다.
		if (global.browser === undefined) {
			global.browser = chrome;
		}
		
		MSG.loadCSV(DPlayInventory.R('text.csv'), () => {
			
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
				excludeURI : ['', 'restoreaccount', 'createaccount', 'login', 'popup/*'],
				target : DPlayInventory.CheckData
			});
			
			DPlayInventory.MATCH_VIEW({
				uri : '**',
				excludeURI : ['restoreaccount', 'createaccount', 'login', 'popup/*'],
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
				uri : 'updateaccount',
				target : DPlayInventory.UpdateAccount
			});
			
			DPlayInventory.MATCH_VIEW({
				uri : 'createguild',
				target : DPlayInventory.CreateGuild
			});
			
			DPlayInventory.MATCH_VIEW({
				uri : 'updateguild',
				target : DPlayInventory.UpdateGuild
			});
			
			DPlayInventory.MATCH_VIEW({
				uri : 'changenetwork',
				target : DPlayInventory.ChangeNetwork
			});
			
			DPlayInventory.MATCH_VIEW({
				uri : 'guild',
				target : DPlayInventory.Guild
			});
			
			DPlayInventory.MATCH_VIEW({
				uri : 'transactionhistory',
				target : DPlayInventory.TransactionHistory
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
			
			DPlayInventory.MATCH_VIEW({
				uri : 'popup/login',
				target : DPlayInventory.Popup.Login
			});
			
			DPlayInventory.MATCH_VIEW({
				uri : 'popup/integrate',
				target : DPlayInventory.Popup.Integrate
			});
			
			DPlayInventory.MATCH_VIEW({
				uri : 'popup/restoreaccount',
				target : DPlayInventory.Popup.RestoreAccount
			});
			
			DPlayInventory.MATCH_VIEW({
				uri : 'popup/createaccount',
				target : DPlayInventory.Popup.CreateAccount
			});
			
			DPlayInventory.MATCH_VIEW({
				uri : 'popup/changenetwork',
				target : DPlayInventory.Popup.ChangeNetwork
			});
			
			DPlayInventory.MATCH_VIEW({
				uri : 'popup/signtext',
				target : DPlayInventory.Popup.SignText
			});
			
			DPlayInventory.MATCH_VIEW({
				uri : 'popup/runmethod',
				target : DPlayInventory.Popup.RunMethod
			});
		});
	}
});
