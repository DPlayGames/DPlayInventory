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
	inner.on('login', (params, callback) => {
		//REQUIRED: params
		//REQUIRED: params.icon
		//REQUIRED: params.title
		
		// 로그인 창을 엽니다.
		window.open(chrome.runtime.getURL('popup/login.html'), 'extension_popup', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=300,height=300');
	});
	
	// 계정의 ID를 가져옵니다.
	inner.on('getAccountId', (notUsing, callback) => {
		inner.sendToBackground({
			methodName : 'getAccountId'
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