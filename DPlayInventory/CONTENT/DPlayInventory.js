window.DPlayInventory = (() => {
	
	let inner = Connector('DPlayInventory');
	let self = {};
	
	// 이더리움 네트워크 이름을 가져옵니다.
	inner.onFromPage('getNetworkName', (notUsing, callback) => {
		inner.sendToBackground({
			methodName : 'getNetworkName'
		}, callback);
	});
	
	inner.onFromPage('networkChanged', () => {
		inner.sendToPage({
			methodName : 'networkChanged'
		});
	});
	
	inner.onFromPage('accountsChanged', (accountId) => {
		inner.sendToPage({
			methodName : 'accountsChanged',
			data : accountId
		});
	});
	
	// 이더리움 네트워크를 변경합니다.
	inner.onFromPage('changeNetwork', (networkName, callback) => {
		inner.sendToBackground({
			methodName : 'changeNetwork',
			data : networkName
		}, callback);
	});
	
	let getFaviconSrc = () => {
		
		let favicon;
		let links = document.getElementsByTagName('link');
		
		for (let i = 0; i < links.length; i += 1) {
			let rel = links[i].getAttribute('rel');
			if (rel === 'icon' || rel === 'shortcut icon') {
				favicon = links[i].getAttribute('href');
				break;
			}
		}
		
		return favicon[0] === '/' ? location.origin + favicon : location.href + '/' + favicon;
	};
	
	// 스마트 계약의 메소드를 실행합니다.
	inner.onFromPage('login', (notUsing, callback) => {
		
		inner.sendToBackground({
			methodName : 'login',
			data : {
				url : location.host,
				title : document.title,
				favicon : getFaviconSrc()
			}
		}, callback);
	});
	
	// 계정의 ID를 가져옵니다.
	inner.onFromPage('getAccountId', (notUsing, callback) => {
		inner.sendToBackground({
			methodName : 'getAccountId',
			data : location.host
		}, callback);
	});
	
	// 문자열에 서명합니다.
	inner.onFromPage('signText', (text, callback) => {
		inner.sendToBackground({
			methodName : 'signText',
			data : text
		}, callback);
	});
	
	// 계정의 이더 잔고를 가져옵니다.
	inner.onFromPage('getEtherBalance', (notUsing, callback) => {
		inner.sendToBackground({
			methodName : 'getEtherBalance'
		}, callback);
	});
	
	// 스마트 계약 인터페이스를 생성합니다.
	inner.onFromPage('createSmartContractInterface', (params, callback) => {
		inner.sendToBackground({
			methodName : 'createSmartContractInterface',
			data : params
		}, callback);
	});
	
	// 트랜잭션이 완료될 때 까지 확인합니다.
	inner.onFromPage('watchTransaction', (transactionHash, callback) => {
		inner.sendToBackground({
			methodName : 'watchTransaction',
			data : transactionHash
		}, callback);
	});
	
	// 스마트 계약의 메소드를 실행합니다.
	inner.onFromPage('runSmartContractMethod', (params, callback) => {
		
		params.title = document.title;
		params.favicon = getFaviconSrc();
		
		inner.sendToBackground({
			methodName : 'runSmartContractMethod',
			data : params
		}, callback);
	});
	
	browser.runtime.connect({
		name : '__CONTRACT_EVENT'
	}).onMessage.addListener((data) => {
		inner.sendToPage({
			methodName : '__CONTRACT_EVENT',
			data : data
		});
	});
	
	return self;
})();