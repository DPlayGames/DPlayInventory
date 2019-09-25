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
						c : FontAwesome.GetIcon('bars'),
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
			
			let openMenu = self.openMenu = () => {
				
				let menu = UL({
					style : {
						position : 'absolute',
						right : 0,
						top : 38
					}
				}).appendTo(wrapper);
				
				EACH([{
					title : '내 계정',
					uri : 'account'
				}, {
					title : '길드 정보',
					uri : 'guild'
				}, {
					title : '네트워크 변경',
					uri : 'changenetwork'
				}], (menuInfo, index) => {
					
					menu.append(LI({
						style : {
							border : '1px solid #666',
							backgroundColor : '#333',
							marginTop : -1
						},
						c : A({
							style : {
								width : 150,
								display : 'block',
								padding : 10,
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