DPlayInventory.Account = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
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
			}), 'user', A({
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
		
		DPlayInventory.Layout.setContent(content);
		
		inner.on('close', () => {
			content.remove();
		});
	}
});