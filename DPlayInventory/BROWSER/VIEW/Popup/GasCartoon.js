DPlayInventory('Popup').GasCartoon = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let nowPage;
		
		let prevButton;
		let pagePanel;
		let nextButton;
		
		let loadPage = (page) => {
			
			// 첫 페이지
			if (page === 1) {
				prevButton.hide();
			} else {
				prevButton.show();
			}
			
			pagePanel.addStyle({
				backgroundImage : DPlayInventory.R('cartoon/' + MSG({
					ko : 'ko',
					en : 'en',
					'zh-CN' : 'zh-CN',
					'zh-TW' : 'zh-TW'
				}) + '/' + page + '.png')
			});
			
			// 마지막 페이지
			if (page === 5) {
				nextButton.hide();
			} else {
				nextButton.show();
			}
			
			nowPage = page;
		};
		
		let wrapper = DIV({
			style : {
				position : 'relative',
				margin : 'auto',
				width : 588,
				height : 352,
				backgroundImage : DPlayInventory.R('cartoon/background.png'),
				backgroundColor : '#666'
			},
			c : [
			prevButton = A({
				style : {
					position : 'absolute',
					top : 149,
					left : 5
				},
				c : IMG({
					src : DPlayInventory.R('cartoon/prevbutton.png')
				}),
				on : {
					tap : () => {
						loadPage(nowPage - 1);
					}
				}
			}),
			
			pagePanel = DIV({
				style : {
					position : 'absolute',
					left : 38,
					top : 32,
					width : 512,
					height : 288
				}
			}),
			
			nextButton = A({
				style : {
					position : 'absolute',
					top : 149,
					right : 5
				},
				c : IMG({
					src : DPlayInventory.R('cartoon/nextbutton.png')
				}),
				on : {
					tap : () => {
						loadPage(nowPage + 1);
					}
				}
			})]
		}).appendTo(BODY);
		
		loadPage(1);
		
		inner.on('close', () => {
			wrapper.remove();
		});
	}
});