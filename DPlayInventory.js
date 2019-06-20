require(process.env.UPPERCASE_PATH + '/LOAD.js');

BOOT({
	CONFIG : {
		defaultBoxName : 'DPlayInventory',
		
		title : 'DPlay Inventory',
		
		isDevMode : true,
		webServerPort : 8620
	},
	
	BROWSER_CONFIG : {
		// 서버와의 실시간 연결은 불필요합니다.
		isNotConnectToServer : true
	},
	
	NODE_CONFIG : {
		// 테스트 목적이기 때문에 CPU 클러스터링 기능을 사용하지 않습니다.
		isSingleCoreMode : true
	}
});
