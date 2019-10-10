DPlayInventory('Popup').RunMethod = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let iconPanel;
		let descriptionPanel;
		let methodNamePanel;
		let gasPanel;
		
		let gasPrice;
		
		let wrapper = UUI.V_CENTER({
			style : {
				position : 'relative',
				margin : 'auto',
				width : 374,
				height : 554,
				backgroundImage : DPlayInventory.R('background.png'),
				color : '#979b9b'
			},
			c : [
			// 로고
			H1({
				style : {
					position : 'absolute',
					top : 12,
					left : 15,
					color : '#707474',
					fontWeight : 'bold'
				},
				c : [MSG('TITLE').substring(0, MSG('TITLE').indexOf('DPlay')), IMG({
					style : {
						width : 51,
						marginBottom : -6
					},
					src : DPlayInventory.R('dplay.png')
				}), MSG('TITLE').substring(MSG('TITLE').indexOf('DPlay') + 5)]
			}),
			
			iconPanel = DIV({
				style : {
					margin : 'auto',
					marginTop : 25,
					width : 120,
					height : 120,
					backgroundRepeat : 'no-repeat',
					backgroundPosition : 'center center',
					backgroundSize : 'contain'
				}
			}),
			
			descriptionPanel = P({
				style : {
					marginTop : 20,
					textAlign : 'center'
				}
			}),
			
			methodNamePanel = DIV(),
			
			UUI.V_CENTER({
				style : {
					flt : 'right',
					width : 187,
					height : 30,
					fontWeight : 'bold',
					backgroundImage : DPlayInventory.R('dialogue/smallbutton.png'),
					cursor : 'pointer',
					color : '#afada8',
					textAlign : 'center'
				},
				c : MSG('RUN_METHOD_PARAMETER_BUTTON'),
				on : {
					tap : () => {
						//TODO:
					}
				}
			}),
			
			CLEAR_BOTH(),
			
			gasPanel = DIV(),
			
			UUI.V_CENTER({
				style : {
					flt : 'right',
					width : 187,
					height : 30,
					fontWeight : 'bold',
					backgroundImage : DPlayInventory.R('dialogue/smallbutton.png'),
					cursor : 'pointer',
					color : '#afada8',
					textAlign : 'center'
				},
				c : MSG('RUN_METHOD_GAS_INTRODUCE_BUTTON'),
				on : {
					tap : () => {
						//TODO:
					}
				}
			}),
			
			CLEAR_BOTH(),
			
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
				c : MSG('RUN_METHOD_BUTTON'),
				on : {
					tap : () => {
						
						DPlayInventory.Core.runSmartContractMethodCallback(gasPrice);
						close();
					}
				}
			})]
		}).appendTo(BODY);
		
		DPlayInventory.Core.getRunSmartContractMethodInfo((info) => {
			
			console.log(info);
			
			iconPanel.addStyle({
				backgroundImage : info.favicon
			});
			
			descriptionPanel.append(MSG('RUN_METHOD_DESCRIPTION').replace(/{game}/, info.title));
			
			methodNamePanel.append(info.methodName);
			
			gasPrice = info.gasPrice;
			
			gasPanel.append((info.gas * info.gasPrice) + ' GWEI');
		});
		
		inner.on('close', () => {
			wrapper.remove();
		});
	}
});