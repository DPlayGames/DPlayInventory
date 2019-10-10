global.DPlayStoreSearchContract = OBJECT({
	
	preset : () => {
		return DPlaySmartContract;
	},
	
	params : () => {
		return {
			
			abi : [{"constant":true,"inputs":[{"name":"ratingCount","type":"uint256"}],"name":"getGameIdsByRating","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"gameId","type":"uint256"},{"name":"language","type":"string"}],"name":"getGameTags","outputs":[{"name":"tag1","type":"string"},{"name":"tag2","type":"string"},{"name":"tag3","type":"string"},{"name":"tag4","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getGameIdsNewest","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"language","type":"string"},{"name":"tag","type":"string"},{"name":"ratingCount","type":"uint256"}],"name":"getGameIdsByTagAndRating","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"language","type":"string"},{"name":"tag","type":"string"}],"name":"getGameIdsByTagNewest","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"ratingCount","type":"uint256"}],"name":"getWebGameIdsByRating","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReleasedGameIds","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"gameId","type":"uint256"},{"name":"language","type":"string"},{"name":"tag1","type":"string"},{"name":"tag2","type":"string"},{"name":"tag3","type":"string"},{"name":"tag4","type":"string"}],"name":"setGameTags","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
			
			addresses : {
				Mainnet : '0xaD7Ba3338A48F144f5ec311f40Ac2555C0458686',
				Kovan : '0xbF92bE17b53fa3d727f1DB47a2dd7A56AF42F5dF',
				Ropsten : '0x4BfF6b76c414f13399738A575e8Cd6346D6d41E6',
				Rinkeby : '0xdb62D4192aA5239F36545C287a8d2DA21b9c4878'
			}
		};
	}
});