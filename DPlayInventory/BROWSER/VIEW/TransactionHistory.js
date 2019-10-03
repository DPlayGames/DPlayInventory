DPlayInventory.TransactionHistory = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
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
				c : MSG('TRANSACTION_HISTORY_TITLE')
			})]
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inner.on('close', () => {
			content.remove();
		});
	}
});