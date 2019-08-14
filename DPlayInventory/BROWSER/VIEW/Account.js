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
			}), 'user']
		});
		
		DPlayInventory.Layout.hideTabs();
		DPlayInventory.Layout.setContent(content);
		
		inner.on('close', () => {
			content.remove();
		});
	}
});