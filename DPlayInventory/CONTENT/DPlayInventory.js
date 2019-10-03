window.DPlayInventory = (() => {
	
	let inner = Connector('DPlayInventory');
	let self = {};
	
	// 이더리움 네트워크 이름을 가져옵니다.
	inner.on('getNetworkName', (notUsing, callback) => {
		inner.sendToBackground({
			methodName : 'getNetworkName'
		}, callback);
	});
	
	inner.on('networkChanged', () => {
		inner.sendToPage({
			methodName : 'networkChanged'
		});
	});
	
	inner.on('accountsChanged', (accountId) => {
		inner.sendToPage({
			methodName : 'accountsChanged',
			data : accountId
		});
	});
	
	// 이더리움 네트워크를 변경합니다.
	inner.on('changeNetwork', (networkName, callback) => {
		inner.sendToBackground({
			methodName : 'changeNetwork',
			data : networkName
		}, callback);
	});
	
	// 스마트 계약의 메소드를 실행합니다.
	inner.on('login', (notUsing, callback) => {
		
		let favicon;
		let links = document.getElementsByTagName('link');
		
		for (let i = 0; i < links.length; i += 1) {
			let rel = links[i].getAttribute('rel');
			if (rel === 'icon' || rel === 'shortcut icon') {
				favicon = links[i].getAttribute('href');
				break;
			}
		}
		
		inner.sendToBackground({
			methodName : 'login',
			data : {
				url : location.host,
				title : document.title,
				favicon : location.href + '/' + favicon
			}
		}, callback);
	});
	
	// 계정의 ID를 가져옵니다.
	inner.on('getAccountId', (notUsing, callback) => {
		inner.sendToBackground({
			methodName : 'getAccountId',
			data : location.host
		}, callback);
	});
	
	// 문자열에 서명합니다.
	inner.on('signText', (text, callback) => {
		inner.sendToBackground({
			methodName : 'signText',
			data : text
		}, callback);
	});
	
	// 계정의 이더 잔고를 가져옵니다.
	inner.on('getEtherBalance', (notUsing, callback) => {
		inner.sendToBackground({
			methodName : 'getEtherBalance'
		}, callback);
	});
	
	// 스마트 계약 인터페이스를 생성합니다.
	inner.on('createSmartContractInterface', (params, callback) => {
		inner.sendToBackground({
			methodName : 'createSmartContractInterface',
			data : params
		}, callback);
	});
	
	// 트랜잭션이 완료될 때 까지 확인합니다.
	inner.on('watchTransaction', (transactionHash, callback) => {
		inner.sendToBackground({
			methodName : 'watchTransaction',
			data : transactionHash
		}, callback);
	});
	
	// 스마트 계약의 메소드를 실행합니다.
	inner.on('runSmartContractMethod', (params, callback) => {
		inner.sendToBackground({
			methodName : 'runSmartContractMethod',
			data : params
		}, callback);
	});
	
	return self;
})();