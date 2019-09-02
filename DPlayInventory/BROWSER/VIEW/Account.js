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
				c : '정보 수정',
				on : {
					tap : () => {
						DPlayInventory.GO('updateaccount');
					}
				}
			}), A({
				style : {
					display : 'block'
				},
				c : '로그아웃',
				on : {
					tap : () => {
						
						DPlayInventory.SecureStore.removePassword(() => {
							DPlayInventory.SecureStore.clear(() => {
								
								DPlayInventory.GO('');
							});
						});
					}
				}
			})]
		});
		
		DPlayInventory.SecureStore.getAccountId((accountId) => {
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