global.MAIN = METHOD({

	run : () => {
		
		// 크롬에서는 browser 객체가 없습니다.
		if (global.browser === undefined) {
			global.browser = chrome;
		}
	}
});