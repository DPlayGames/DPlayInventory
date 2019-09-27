DPlayInventory.ChangeNetwork = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let content = UL({
			c : [/*LI({
				style : {
					cursor : 'pointer'
				},
				c : 'Mainnet',
				on : {
					tap : () => {
						DPlayInventory.Core.changeNetwork('Mainnet');
					}
				}
			}), */LI({
				style : {
					cursor : 'pointer'
				},
				c : 'Kovan',
				on : {
					tap : () => {
						DPlayInventory.Core.changeNetwork('Kovan');
					}
				}
			})/*, LI({
				style : {
					cursor : 'pointer'
				},
				c : 'Ropsten',
				on : {
					tap : () => {
						DPlayInventory.Core.changeNetwork('Ropsten');
					}
				}
			}), LI({
				style : {
					cursor : 'pointer'
				},
				c : 'Rinkeby',
				on : {
					tap : () => {
						DPlayInventory.Core.changeNetwork('Rinkeby');
					}
				}
			})*/]
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inner.on('close', () => {
			content.remove();
		});
	}
});