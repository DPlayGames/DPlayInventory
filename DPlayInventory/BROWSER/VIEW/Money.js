DPlayInventory.Money = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let inventoryStore = DPlayInventory.STORE('inventoryStore');
		
		let dcPanel;
		let dPanel;
		let etherPanel;
		
		let content = DIV({
			style : {
				position : 'relative',
				width : 370,
				height : 475,
				backgroundImage : DPlayInventory.R('money/background.png')
			},
			c : [
			
			dcPanel = DIV({
				style : {
					position : 'absolute',
					top : 32,
					right : 110
				},
				c : IMG({
					src : DPlayInventory.R('textloading.gif')
				})
			}), UUI.V_CENTER({
				style : {
					position : 'absolute',
					top : 130,
					left : 46,
					width : 104,
					height : 27,
					backgroundImage : DPlayInventory.R('money/dcbutton.png'),
					textAlign : 'center',
					cursor : 'pointer'
				},
				c : MSG('CHARGE_MONEY_BUTTON'),
				on : {
					tap : () => {
						open('http://chargedc.dplay.games');
					}
				}
			}), UUI.V_CENTER({
				style : {
					position : 'absolute',
					top : 130,
					right : 100,
					width : 104,
					height : 27,
					backgroundImage : DPlayInventory.R('money/dcbutton.png'),
					textAlign : 'center',
					cursor : 'pointer'
				},
				c : MSG('SEND_MONEY_BUTTON'),
				on : {
					tap : () => {
						//TODO:
					}
				}
			}),
			
			etherPanel = DIV({
				style : {
					position : 'absolute',
					top : 206,
					right : 110
				},
				c : IMG({
					src : DPlayInventory.R('textloading.gif')
				})
			}), UUI.V_CENTER({
				style : {
					position : 'absolute',
					top : 233,
					left : 46,
					width : 104,
					height : 27,
					backgroundImage : DPlayInventory.R('money/etherbutton.png'),
					textAlign : 'center',
					cursor : 'pointer'
				},
				c : MSG('CHARGE_MONEY_BUTTON'),
				on : {
					tap : () => {
						open('http://chargeether.dplay.games');
					}
				}
			}), UUI.V_CENTER({
				style : {
					position : 'absolute',
					top : 233,
					right : 100,
					width : 104,
					height : 27,
					backgroundImage : DPlayInventory.R('money/etherbutton.png'),
					textAlign : 'center',
					cursor : 'pointer'
				},
				c : MSG('SEND_MONEY_BUTTON'),
				on : {
					tap : () => {
						//TODO:
					}
				}
			}),
			
			dPanel = DIV({
				style : {
					position : 'absolute',
					top : 309,
					right : 110
				},
				c : IMG({
					src : DPlayInventory.R('textloading.gif')
				})
			}), UUI.V_CENTER({
				style : {
					position : 'absolute',
					top : 335,
					left : 46,
					width : 104,
					height : 27,
					backgroundImage : DPlayInventory.R('money/dbutton.png'),
					textAlign : 'center',
					cursor : 'pointer'
				},
				c : MSG('CHARGE_MONEY_BUTTON'),
				on : {
					tap : () => {
						
						let message = MSG('DOWNLOAD_DSIDE_MESSAGE');
						let messages = [];
						
						let dIndex = message.indexOf('<b>d</b>');
						if (dIndex !== -1) {
							messages.push(message.substring(0, dIndex));
							messages.push(SPAN({
								style : {
									color : '#980100',
									fontWeight : 'bold'
								},
								c : 'd'
							}));
							messages.push(message.substring(dIndex + 8));
						} else {
							messages.push(message);
						}
						
						DPlayInventory.Confirm({
							content : messages
						}, () => {
							open('http://dside.dplay.games');
						});
					}
				}
			}), UUI.V_CENTER({
				style : {
					position : 'absolute',
					top : 335,
					right : 100,
					width : 104,
					height : 27,
					backgroundImage : DPlayInventory.R('money/dbutton.png'),
					textAlign : 'center',
					cursor : 'pointer'
				},
				c : MSG('SEND_MONEY_BUTTON'),
				on : {
					tap : () => {
						//TODO:
					}
				}
			})]
		});
		
		DPlayInventory.DPlayCoin.getBalance((balance) => {
			dcPanel.empty();
			dcPanel.append(SPAN({
				style : {
					color : '#980100'
				},
				c : 'DC '
			}));
			dcPanel.append(DPlayInventory.DPlayCoin.getDisplayPrice(balance));
		});
		
		DPlayInventory.DSide.getDBalance((balance) => {
			dPanel.empty();
			dPanel.append(SPAN({
				style : {
					color : '#980100'
				},
				c : 'd '
			}))
			dPanel.append(balance);
		});
		
		DPlayInventory.Core.getEtherBalance((balance) => {
			etherPanel.empty();
			etherPanel.append('Ether ' + DPlayInventory.Core.getDisplayPrice(balance));
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inventoryStore.save({
			name : 'lastTab',
			value : 'money'
		});
		
		inner.on('close', () => {
			content.remove();
		});
	}
});