require(process.env.UPPERCASE_PATH + '/LOAD.js');

BOOT({
	CONFIG : {
		defaultBoxName : 'DPlayInventory',
		
		title : 'DPlay Inventory',
		
		isDevMode : true,
		webServerPort : 8620
	},
	
	BROWSER_CONFIG : {
		isNotConnectToServer : true
	},
	
	NODE_CONFIG : {
		isSingleCoreMode : true
	}
});
