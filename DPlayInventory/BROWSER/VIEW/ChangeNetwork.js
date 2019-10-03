DPlayInventory.ChangeNetwork = CLASS({

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
					paddingTop : 50,
					paddingBottom : 40,
					fontWeight : 'bold',
					fontSize : 20
				},
				c : MSG('CHANGE_NETWORK_TITLE')
			})]
		});
		
		EACH([
			'Mainnet',
			'Kovan',
			'Ropsten',
			'Rinkeby'
		], (networkName) => {
			
			content.append(UUI.V_CENTER({
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
				c : networkName,
				on : {
					tap : () => {
						
						DPlayInventory.Core.changeNetwork(networkName, () => {
							DPlayInventory.GO('');
						});
					}
				}
			}));
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inner.on('close', () => {
			content.remove();
		});
	}
});