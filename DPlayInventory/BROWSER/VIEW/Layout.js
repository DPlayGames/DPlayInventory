DPlayInventory.Layout = CLASS((cls) => {
	
	let contentWrapper;
	
	let setContent = cls.setContent = (content) => {
		contentWrapper.empty();
		contentWrapper.append(content);
	};
	
	return {
		
		preset : () => {
			return VIEW;
		},
		
		init : (inner, self) => {
			
			let tabWrapper;
			let gameTab;
			let moneyTab;
			let itemTab;
			
			let wrapper = DIV({
				style : {
					position : 'relative',
					margin : 'auto',
					width : 370,
					height : 550,
					backgroundColor : '#000'
				},
				c : [
				
				// 상단 바
				DIV({
					style : {
						padding : 0
					},
					c : [
					
					// 로고
					A({
						style : {
							flt : 'left',
							padding : 10,
							color : '#707474'
						},
						c : [SPAN({
							style : {
								color : '#980100',
								fontWeight : 'bold',
							},
							c : 'DPlay'
						}), ' 보관함'],
						on : {
							tap : () => {
								DPlayInventory.GO('');
							}
						}
					}),
					
					// 메뉴 버튼
					A({
						style : {
							padding : 12,
							paddingBottom : 10,
							flt : 'right',
							color : '#980100'
						},
						c : FontAwesome.GetIcon('user'),
						on : {
							tap : () => {
								DPlayInventory.GO('account');
							}
						}
					}),
					
					CLEAR_BOTH()]
				}),
				
				// 탭
				tabWrapper = DIV({
					c : [gameTab = A({
						style : {
							flt : 'left',
							width : 120,
							padding : '5px 0',
							textAlign : 'center',
							backgroundColor : '#151515',
							borderRadius : '5px 5px 0 0'
						},
						c : '게임',
						on : {
							tap : () => {
								DPlayInventory.GO('game');
							}
						}
					}), moneyTab = A({
						style : {
							marginLeft : 5,
							flt : 'left',
							width : 120,
							padding : '5px 0',
							textAlign : 'center',
							backgroundColor : '#151515',
							borderRadius : '5px 5px 0 0'
						},
						c : '재화',
						on : {
							tap : () => {
								DPlayInventory.GO('money');
							}
						}
					}), itemTab = A({
						style : {
							marginLeft : 5,
							flt : 'left',
							width : 120,
							padding : '5px 0',
							textAlign : 'center',
							backgroundColor : '#151515',
							borderRadius : '5px 5px 0 0'
						},
						c : '아이템',
						on : {
							tap : () => {
								DPlayInventory.GO('item');
							}
						}
					}), CLEAR_BOTH()]
				}),
				
				// 내용
				contentWrapper = DIV({
					style : {
						backgroundColor : '#1e1e1e',
						height : 483
					}
				})]
			}).appendTo(BODY);
			
			let hideTabs = () => {
				tabWrapper.hide();
				contentWrapper.addStyle({
					height : 512
				});
			}
			
			let showTabs = () => {
				tabWrapper.show();
				contentWrapper.addStyle({
					height : 483
				});
			}
			
			let onTab = (tab) => {
				tab.addStyle({
					backgroundColor : '#1e1e1e'
				});
			}
			
			let offTab = (tab) => {
				tab.addStyle({
					backgroundColor : '#151515'
				});
			}
			
			inner.on('uriChange', (uri) => {
				
				if (uri === 'game') {
					showTabs();
					onTab(gameTab);
					offTab(moneyTab);
					offTab(itemTab);
				}
				
				else if (uri === 'money') {
					showTabs();
					offTab(gameTab);
					onTab(moneyTab);
					offTab(itemTab);
				}
				
				else if (uri === 'item') {
					showTabs();
					offTab(gameTab);
					offTab(moneyTab);
					onTab(itemTab);
				}
				
				else {
					hideTabs();
				}
			});
			
			inner.on('close', () => {
				
				wrapper.remove();
				
				contentWrapper = undefined;
			});
		}
	};
});