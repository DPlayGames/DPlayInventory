DPlayInventory.Item = CLASS({
	
	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let inventoryStore = DPlayInventory.STORE('inventoryStore');
		
		let itemList;
		
		let loading;
		let content = DIV({
			style : {
				position : 'relative'
			},
			c : [itemList = UUI.PANEL({
				style : {
					height : 483,
					overflowY : 'scroll'
				},
				contentStyle : {
					padding : '2px 0 2px 2px'
				}
			}), CLEAR_BOTH(), loading = UUI.V_CENTER({
				style : {
					position : 'absolute',
					left : 0,
					top : 0,
					backgroundColor : 'rgba(0, 0, 0, 0.5)',
					width : '100%',
					height : '100%',
					textAlign : 'center'
				},
				c : IMG({
					src : DPlayInventory.R('loading.png')
				})
			})]
		});
		
		let addItem = (itemType, addresses, gameName, itemName, imageSrc, balance, itemId) => {
			
			if (balance === undefined || balance > 0) {
				
				itemList.append(UUI.PANEL({
					style : {
						position : 'relative',
						flt : 'left',
						marginLeft : 1,
						marginBottom : 1,
						width : 50,
						height : 50,
						backgroundImage : DPlayInventory.R('itemslot.png'),
						backgroundRepeat : 'no-repeat',
						backgroundPosition : 'center center',
						backgroundSize : 'contain',
						padding : 10,
						cursor : 'pointer'
					},
					contentStyle : {
						width : 50,
						height : 50,
						backgroundImage : imageSrc,
						backgroundRepeat : 'no-repeat',
						backgroundPosition : 'center center',
						backgroundSize : 'contain'
					},
					c : balance === undefined ? undefined : SPAN({
						style : {
							position : 'absolute',
							right : 7,
							bottom : 4,
							color : '#f6f4e3',
							textShadow : DPlayInventory.TextBorderShadow('#403414')
						},
						c : balance
					}),
					on : {
						tap : () => {
							
							DPlayInventory.SendItemPopup({
								itemType : itemType,
								addresses : addresses,
								gameName : gameName,
								itemName : itemName,
								imageSrc : imageSrc,
								itemId : itemId
							}, REFRESH);
						}
					}
				}));
			}
		};
		
		EACH(DPlayInventory.ERC20_ITEMS, (items, gameName) => {
			EACH(items, (itemInfo, itemName) => {
				
				DPlayInventory.Core.getERC20Balance(itemInfo.addresses, (balance) => {
					
					if (loading !== undefined) {
						loading.remove();
						loading = undefined;
					}
					
					addItem('ERC20', itemInfo.addresses, gameName, itemName, itemInfo.image, balance);
				});
			});
		});
		
		EACH(DPlayInventory.ERC721_ITEMS, (items, gameName) => {
			EACH(items, (itemInfo, itemName) => {
				
				DPlayInventory.Core.getERC721Ids({
					getItemIdsName : itemInfo.getItemIdsName,
					addresses : itemInfo.addresses
				}, (ids) => {
					
					if (loading !== undefined) {
						loading.remove();
						loading = undefined;
					}
					
					EACH(ids, (id) => {
						addItem('ERC721', itemInfo.addresses, gameName, itemName, itemInfo.image.replace(/{id}/g, id), id);
					});
				});
			});
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inventoryStore.save({
			name : 'lastTab',
			value : 'item'
		});
		
		inner.on('close', () => {
			content.remove();
		});
	}
});