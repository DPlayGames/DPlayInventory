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
			let itemTab;
			let moneyTab;
			
			let wrapper = DIV({
				style : {
					position : 'relative',
					margin : 'auto',
					width : 374,
					height : 554,
					backgroundImage : DPlayInventory.R('background.png'),
					color : '#979b9b'
				},
				c : [
				
				// 로고
				H1({
					style : {
						position : 'absolute',
						top : 12,
						left : 15,
						color : '#707474',
						fontWeight : 'bold',
						cursor : 'pointer'
					},
					c : [MSG('TITLE').substring(0, MSG('TITLE').indexOf('DPlay')), IMG({
						style : {
							width : 51,
							marginBottom : -6
						},
						src : DPlayInventory.R('dplay.png')
					}), MSG('TITLE').substring(MSG('TITLE').indexOf('DPlay') + 5)],
					on : {
						tap : () => {
							DPlayInventory.GO('');
						}
					}
				}),
				
				// 상단 바
				DIV({
					style : {
						padding : 0
					},
					c : [
					
					// 메뉴 버튼
					A({
						style : {
							padding : 15,
							paddingBottom : 5,
							flt : 'right',
							color : '#980100'
						},
						c : IMG({
							src : DPlayInventory.R('menu.png')
						}),
						on : {
							tap : () => {
								openMenu();
							}
						}
					}),
					
					CLEAR_BOTH()]
				}),
				
				// 탭
				tabWrapper = DIV({
					style : {
						marginLeft : 4,
						marginTop : 6,
					},
					c : [gameTab = A({
						style : {
							flt : 'left',
							width : 118,
							height : 16,
							padding : '5px 0',
							textAlign : 'center',
							fontWeight : 'bold'
						},
						c : MSG('GAME_TAB'),
						on : {
							tap : () => {
								DPlayInventory.GO('game');
							}
						}
					}), itemTab = A({
						style : {
							marginLeft : 5,
							flt : 'left',
							width : 118,
							height : 16,
							padding : '5px 0',
							textAlign : 'center',
							fontWeight : 'bold'
						},
						c : MSG('ITEM_TAB'),
						on : {
							tap : () => {
								DPlayInventory.GO('item');
							}
						}
					}), moneyTab = A({
						style : {
							marginLeft : 5,
							flt : 'left',
							width : 118,
							height : 16,
							padding : '5px 0',
							textAlign : 'center',
							fontWeight : 'bold'
						},
						c : MSG('MONEY_TAB'),
						on : {
							tap : () => {
								DPlayInventory.GO('money');
							}
						}
					}), CLEAR_BOTH()]
				}),
				
				// 내용
				contentWrapper = DIV({
					style : {
						height : 475,
						backgroundImage : DPlayInventory.R('foreground.png')
					}
				})]
			}).appendTo(BODY);
			
			let openMenu = self.openMenu = () => {
				
				let menu = UL({
					style : {
						position : 'absolute',
						right : 0,
						top : 38
					}
				}).appendTo(wrapper);
				
				EACH([{
					title : MSG('MENU_MY_ACCOUNT'),
					uri : 'account'
				}, {
					title : MSG('MENU_GUILD'),
					uri : 'guild'
				}, {
					title : MSG('MENU_CHANGE_NETWORK'),
					uri : 'changenetwork'
				}, {
					title : MSG('TRANSACTION_HISTORY_BUTTON'),
					uri : 'transactionhistory'
				}], (menuInfo, index) => {
					
					menu.append(LI({
						style : {
							borderBottom : '1px solid #000',
							backgroundColor : '#333'
						},
						c : A({
							style : {
								width : 150,
								display : 'block',
								padding : 8,
								textAlign : 'center'
							},
							c : menuInfo.title,
							on : {
								touchstart : () => {
									DPlayInventory.GO(menuInfo.uri);
								}
							}
						})
					}));
				});
				
				EVENT_ONCE('touchstart', () => {
					menu.remove();
				});
			};
			
			let hideTabs = () => {
				tabWrapper.hide();
				contentWrapper.addStyle({
					height : 500
				});
			}
			
			let showTabs = () => {
				tabWrapper.show();
				contentWrapper.addStyle({
					height : 475
				});
			}
			
			let onTab = (tab) => {
				tab.addStyle({
					backgroundImage : DPlayInventory.R('tabon.png')
				});
			}
			
			let offTab = (tab) => {
				tab.addStyle({
					backgroundImage : DPlayInventory.R('tab.png')
				});
			}
			
			inner.on('uriChange', (uri) => {
				
				if (uri === 'game') {
					showTabs();
					onTab(gameTab);
					offTab(itemTab);
					offTab(moneyTab);
				}
				
				else if (uri === 'item') {
					showTabs();
					offTab(gameTab);
					onTab(itemTab);
					offTab(moneyTab);
				}
				
				else if (uri === 'money') {
					showTabs();
					offTab(gameTab);
					offTab(itemTab);
					onTab(moneyTab);
				}
				
				else if (uri === 'signrecord') {
					showTabs();
					offTab(gameTab);
					offTab(itemTab);
					offTab(moneyTab);
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