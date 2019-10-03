DPlayInventory('Popup').Integrate = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let iconPanel;
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
			c : [
			H3({
				style : {
					padding : 2,
					fontWeight : 'bold',
					textAlign : 'center'
				},
				c : MSG('INTEGRATE_TITLE')
			}),
			
			iconPanel = DIV({
				style : {
					margin : 'auto',
					marginTop : 25,
					width : 80,
					height : 80,
					backgroundRepeat : 'no-repeat',
					backgroundPosition : 'center center',
					backgroundSize : 'contain'
				}
			}),
			
			descriptionPanel = P({
				style : {
					marginTop : 10,
					textAlign : 'center'
				}
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
				c : MSG('INTEGRATE_BUTTON'),
				on : {
					tap : () => {
						DPlayInventory.Core.integrate();
						close();
					}
				}
			})]
		}).appendTo(BODY);
		
		DPlayInventory.Core.getLoginParams((loginParams) => {
			
			iconPanel.addStyle({
				backgroundImage : loginParams.favicon
			});
			
			descriptionPanel.append(MSG('INTEGRATE_DESCRIPTION').replace(/{game}/, loginParams.title));
		});
		
		inner.on('close', () => {
			wrapper.remove();
		});
	}
});