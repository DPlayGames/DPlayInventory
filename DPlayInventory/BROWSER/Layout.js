DPlayInventory.Layout = OBJECT({
	
	init : (inner, self) => {
		
		let contentWrapper;
		
		DIV({
			style : {
				margin : 'auto',
				width : 376,
				height : 568,
				backgroundImage : '/DPlayInventory/R/background.png',
				backgroundSize : 'cover'
			},
			c : [
			// 상단
			DIV({
				style : {
					padding : 10
				},
				c : [
				// 로고
				IMG({
					style : {
						flt : 'left',
						color : '#707474',
						fontWeight : 'bold'
					},
					src : '/DPlayInventory/R/dplaylogo.png'
				}),
				SPAN({
					style : {
						marginLeft : 5,
						marginTop : 6,
						flt : 'left',
						color : '#707474',
						fontWeight : 'bold'
					},
					c : '보관함'
				}), CLEAR_BOTH()]
			}),
			
			// 내용
			contentWrapper = DIV({
				style : {
					width : 364,
					height : 454,
					backgroundImage : '/DPlayInventory/R/wallet.png',
					backgroundSize : 'cover'
				}
			})
			]
		}).appendTo(BODY);
		
		// 내용을 등록합니다.
		let setContent = self.setContent = (content) => {
			//REQUIRED: content
			
			contentWrapper.append(content);
		};
		
		// 내용을 삭제합니다.
		let removeContent = self.removeContent = () => {
			contentWrapper.empty();
		};
	}
});