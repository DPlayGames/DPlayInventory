DPlayInventory('Popup').ChangeNetwork = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let descriptionPanel;
		let wrapper = DIV({
			style : {
				position : 'relative',
				margin : 'auto',
				width : 340,
				height : 240,
				backgroundImage : DPlayInventory.R('dialogue/background.png'),
				color : '#979b9b'
			},
			c : [H3({
				style : {
					padding : 2,
					fontWeight : 'bold',
					textAlign : 'center'
				},
				c : MSG('CHANGE_NETWORK_TITLE')
			}),
			
			UUI.V_CENTER({
				style : {
					height : 170
				},
				c : descriptionPanel = P({
					style : {
						padding : 10,
						textAlign : 'center'
					}
				})
			}),
			
			UUI.V_CENTER({
				style : {
					position : 'absolute',
					bottom : 20,
					left : '50%',
					marginLeft : -137.5,
					width : 275,
					height : 33,
					fontWeight : 'bold',
					backgroundImage : DPlayInventory.R('dialogue/button.png'),
					cursor : 'pointer',
					color : '#afada8',
					textAlign : 'center'
				},
				c : MSG('CHANGE_NETWORK_BUTTON'),
				on : {
					tap : () => {
						DPlayInventory.Core.changeNetworkCallback();
						close();
					}
				}
			})]
		}).appendTo(BODY);
		
		DPlayInventory.Core.getChangeNetworkName((networkName) => {
			descriptionPanel.append(MSG('CHANGE_NETWORK_DESCRIPTION').replace(/{network}/, networkName));
		});
		
		inner.on('close', () => {
			wrapper.remove();
		});
	}
});