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
						DPlayInventory.Ethereum.changeNetwork('Mainnet');
					}
				}
			}), */LI({
				style : {
					cursor : 'pointer'
				},
				c : 'Kovan',
				on : {
					tap : () => {
						DPlayInventory.Ethereum.changeNetwork('Kovan');
					}
				}
			})/*, LI({
				style : {
					cursor : 'pointer'
				},
				c : 'Ropsten',
				on : {
					tap : () => {
						DPlayInventory.Ethereum.changeNetwork('Ropsten');
					}
				}
			}), LI({
				style : {
					cursor : 'pointer'
				},
				c : 'Rinkeby',
				on : {
					tap : () => {
						DPlayInventory.Ethereum.changeNetwork('Rinkeby');
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