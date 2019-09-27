DPlayInventory.Account = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let namePanel;
		let introducePanel;
		let content = DIV({
			style : {
				position : 'relative'
			},
			c : [A({
				style : {
					position : 'absolute',
					right : 12,
					top : 10
				},
				c : FontAwesome.GetIcon('times'),
				on : {
					tap : () => {
						DPlayInventory.GO('');
					}
				}
			}), namePanel = DIV(), introducePanel = DIV(), A({
				style : {
					display : 'block'
				},
				c : MSG('UPDATE_ACCOUNT_BUTTON'),
				on : {
					tap : () => {
						DPlayInventory.GO('updateaccount');
					}
				}
			}), A({
				style : {
					display : 'block'
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
			DPlayInventory.DSide.getAccountDetail(accountId, (accountDetail) => {
				
				if (accountDetail !== undefined) {
					
					namePanel.append(accountDetail.name);
					introducePanel.append(accountDetail.introduce);
				}
			});
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inner.on('close', () => {
			content.remove();
		});
	}
});