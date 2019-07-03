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
					padding : 0
				},
				c : [
				
				// 로고
				IMG({
					style : {
						marginLeft : 10,
						marginTop : 12,
						flt : 'left',
						color : '#707474',
						fontWeight : 'bold',
						width : 102 / 2,
						height : 41 / 2
					},
					src : '/DPlayInventory/R/dplaylogo.png'
				}),
				SPAN({
					style : {
						marginLeft : 5,
						marginTop : 13,
						flt : 'left',
						color : '#707474',
						fontWeight : 'bold'
					},
					c : '보관함'
				}),
				
				// 메뉴 버튼
				A({
					style : {
						padding : 14,
						flt : 'right'
					},
					c : IMG({
						width : 33 / 2,
						height : 25 / 2,
						src : '/DPlayInventory/R/menu.png'
					})
				}),
				
				CLEAR_BOTH()]
			}),
			
			// 내용
			contentWrapper = DIV({
				style : {
					margin : 'auto',
					marginTop : -3,
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