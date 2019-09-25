RUN(() => {
	
	// 보관함에 로그인합니다.
	on('login', (params, callback) => {
		//REQUIRED: params
		//REQUIRED: params.icon
		//REQUIRED: params.title
		
		// 로그인 창을 엽니다.
		window.open(chrome.runtime.getURL('popup/login.html'), 'extension_popup', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=300,height=300');
	});
	
	// 계정의 ID를 가져옵니다.
	on('getAccountId', (notUsing, callback) => {
		
	});
	
	// 스마트 계약 인터페이스를 생성합니다.
	on('createContractInterface', (params, callback) => {
		//REQUIRED: params
		//REQUIRED: params.abi
		//REQUIRED: params.bytecode
		
	});
	
	// 스마트 계약의 메소드를 실행합니다.
	on('runContractMethod', (params, callback) => {
		//REQUIRED: params
		
	});
});