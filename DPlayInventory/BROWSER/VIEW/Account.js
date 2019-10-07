DPlayInventory.Account = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let idPanel;
		let namePanel;
		let introducePanel;
		
		let content = DIV({
			style : {
				position : 'relative',
				textAlign : 'center'
			},
			c : [A({
				style : {
					position : 'absolute',
					left : 12,
					top : 10
				},
				c : IMG({
					src : DPlayInventory.R('backbutton.png')
				}),
				on : {
					tap : () => {
						DPlayInventory.GO('');
					}
				}
			}),
			
			H1({
				style : {
					paddingTop : 40,
					fontWeight : 'bold',
					fontSize : 20
				},
				c : MSG('ACCOUNT_INFO_TITLE')
			}),
			
			idPanel = DIV({
				style : {
					marginTop : 30
				}
			}),
			
			namePanel = DIV({
				style : {
					marginTop : 15
				}
			}),
			
			introducePanel = DIV({
				style : {
					marginTop : 15
				}
			}),
			
			UUI.V_CENTER({
				style : {
					margin : 'auto',
					marginTop : 30,
					width : 330,
					height : 33,
					backgroundImage : DPlayInventory.R('button.png'),
					textAlign : 'center',
					cursor : 'pointer',
					color : '#afada8',
					fontWeight : 'bold'
				},
				c : MSG('UPDATE_ACCOUNT_BUTTON'),
				on : {
					tap : () => {
						DPlayInventory.GO('updateaccount');
					}
				}
			}),
			
			UUI.V_CENTER({
				style : {
					margin : 'auto',
					marginTop : 10,
					width : 330,
					height : 33,
					backgroundImage : DPlayInventory.R('button.png'),
					textAlign : 'center',
					cursor : 'pointer',
					color : '#afada8',
					fontWeight : 'bold'
				},
				c : MSG('LOGOUT_BUTTON'),
				on : {
					tap : () => {
						
						DPlayInventory.Core.removePassword(() => {
							DPlayInventory.Core.clear(() => {
								
								DPlayInventory.GO('');
							});
						});
					}
				}
			})]
		});
		
		DPlayInventory.Core.getAccountId((accountId) => {
			
			idPanel.append(H2({
				style : {
					fontWeight : 'bold'
				},
				c : MSG('MY_ACCOUNT_ID')
			}));
			idPanel.append(P({
				style : {
					padding : 15,
					fontSize : 12
				},
				c : accountId
			}));
			
			DPlayInventory.DSide.getAccountDetail(accountId, (accountDetail) => {
				
				if (accountDetail !== undefined) {
					
					namePanel.append(H2({
						style : {
							fontWeight : 'bold'
						},
						c : MSG('ACCOUNT_NAME')
					}));
					namePanel.append(P({
						style : {
							padding : 15
						},
						c : accountDetail.name
					}));
					
					introducePanel.append(H2({
						style : {
							fontWeight : 'bold'
						},
						c : MSG('ACCOUNT_INTRODUCE')
					}));
					introducePanel.append(P({
						style : {
							padding : 15
						},
						c : accountDetail.introduce
					}));
				}
			});
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inner.on('close', () => {
			content.remove();
		});
	}
});