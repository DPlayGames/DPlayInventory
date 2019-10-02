DPlayInventory.Game = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let inventoryStore = DPlayInventory.STORE('inventoryStore');
		
		let webGameList;
		let content = DIV({
			c : [
			// 구매한 게임 목록
			DIV({
				style : {
					
				},
				c : [H3({
					style : {
						padding : '10px 15px',
						fontWeight : 'bold'
					},
					c : MSG('GAME_LIST_TITLE')
				}), DIV({
					style : {
						textAlign : 'center',
						padding : '30px 0'
					},
					c : [IMG({
						src : DPlayInventory.R('sadcoinman.png')
					}), P({
						style : {
							marginTop : 10,
							color : '#3a3d3d',
							fontWeight : 'bold'
						},
						c : MSG('EMPTY_GAME_LIST_MESSAGE')
					})]
				})]
			}),
			
			DIV({
				style : {
					textAlign : 'center'
				},
				c : IMG({
					src : DPlayInventory.R('line.png')
				})
			}),
			
			// 웹 게임 목록
			DIV({
				c : [H3({
					style : {
						padding : '10px 15px',
						fontWeight : 'bold'
					},
					c : MSG('WEB_GAME_LIST_TITLE')
				}), DIV({
					style : {
						textAlign : 'center',
						padding : '30px 0'
					},
					c : [IMG({
						src : DPlayInventory.R('sadcoinman.png')
					}), P({
						style : {
							marginTop : 10,
							color : '#3a3d3d',
							fontWeight : 'bold'
						},
						c : MSG('EMPTY_WEB_GAME_LIST_MESSAGE')
					})]
				})]
			})]
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inventoryStore.save({
			name : 'lastTab',
			value : 'game'
		});
		
		inner.on('close', () => {
			content.remove();
		});
	}
});