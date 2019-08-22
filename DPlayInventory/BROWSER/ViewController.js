//!! 테스트용 뷰 컨트롤러
//!! 절대 이를 이용해 배포하면 안됩니다.
DPlayInventory.ViewController = OBJECT({

	init : (inner, self) => {
		
		let changeView = self.changeView = (params) => {
			
			DPlayInventory.GO(params.url);
		};
	}
});