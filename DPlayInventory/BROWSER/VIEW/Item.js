DPlayInventory.Item = CLASS(() => {
	
	let itemCache = {};
	
	return {
	
		preset : () => {
			return VIEW;
		},
	
		init : (inner, self) => {
			
			let inventoryStore = DPlayInventory.STORE('inventoryStore');
			
			let itemList;
			let isInit = true;
			
			let itemPanels = {};
			let content = DIV({
				c : [itemList = UUI.PANEL({
					style : {
						height : 483,
						overflowY : 'scroll'
					},
					contentStyle : {
						padding : '8px 0px 8px 3px'
					},
					c : '아이템 목록을 불러오는 중입니다.'
				}), CLEAR_BOTH()]
			});
			
			let addItem = (key, image, balance) => {
				
				if (balance === undefined || balance > 0) {
					
					if (isInit === true) {
						itemList.empty();
						isInit = false;
					}
					
					let itemPanel;
					itemList.append(itemPanel = DIV({
						style : {
							position : 'relative',
							flt : 'left',
							marginLeft : 5,
							marginBottom : 5,
							width : 50,
							height : 50,
							backgroundImage : image,
							backgroundRepeat : 'no-repeat',
							backgroundPosition : 'center center',
							backgroundSize : 'contain',
							border : '1px solid #999'
						},
						c : balance === undefined ? undefined : SPAN({
							style : {
								position : 'absolute',
								right : 5,
								bottom : 5
							},
							c : balance
						})
					}));
					
					itemPanels[key] = itemPanel;
				}
			};
			
			EACH(itemCache, (info, address) => {
				addItem(address, info.image, info.balance);
			});
			
			EACH(DPlayInventory.ERC20_ITEMS, (items, projectName) => {
				EACH(items, (itemInfo, itemName) => {
					
					DPlayInventory.Ethereum.getERC20Balance(itemInfo.addresses, (balance, address) => {
						
						itemCache[address] = {
							image : itemInfo.image,
							balance : balance
						};
						
						if (itemPanels[address] !== undefined) {
							itemPanels[address].empty();
							itemPanels[address].append(SPAN({
								style : {
									position : 'absolute',
									right : 5,
									bottom : 5
								},
								c : balance
							}));
						}
						
						else {
							addItem(address, itemInfo.image, balance);
						}
					});
				});
			});
			
			EACH(DPlayInventory.ERC721_ITEMS, (items, projectName) => {
				EACH(items, (itemInfo, itemName) => {
					
					DPlayInventory.Ethereum.getERC721Ids({
						getItemIdsName : itemInfo.getItemIdsName,
						addresses : itemInfo.addresses
					}, (ids, address) => {
						
						EACH(ids, (id) => {
							
							let key = address + ' ' + id;
							
							let image = itemInfo.image.replace(/{id}/g, id);
							itemCache[key] = {
								id : id,
								image : image
							};
							
							if (itemPanels[key] === undefined) {
								addItem(key, image);
							}
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
	};
});