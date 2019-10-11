DPlayInventory('Popup').RunMethod = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let iconPanel;
		let descriptionPanel;
		let methodNamePanel;
		let gasPanel;
		
		let methodParams;
		let gas;
		let gasPriceAverage;
		let gasPriceFast;
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
			contentStyle : {
				paddingBottom : 120
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
			
			methodNamePanel = DIV({
				style : {
					marginLeft : 10,
					marginTop : 30,
					padding : 10
				}
			}),
			
			UUI.V_CENTER({
				style : {
					marginRight : 20,
					flt : 'right',
					width : 187,
					height : 30,
					fontWeight : 'bold',
					backgroundImage : DPlayInventory.R('smallbutton.png'),
					cursor : 'pointer',
					color : '#afada8',
					textAlign : 'center'
				},
				c : MSG('RUN_METHOD_PARAMETER_BUTTON'),
				on : {
					tap : () => {
						
						let content = P({
							style : {
								textAlign : 'left',
								wordBreak : 'break-all',
								height : 155,
								overflowY : 'scroll'
							}
						});
						
						EACH(methodParams, (value, name) => {
							content.append(name + ' : ' + JSON.stringify(value) + '\n');
						});
						
						DPlayInventory.Alert({
							title : MSG('RUN_METHOD_PARAMETER_TITLE'),
							content : content
						});
					}
				}
			}),
			
			CLEAR_BOTH(),
			
			gasPanel = DIV({
				style : {
					marginLeft : 10,
					marginTop : 10,
					padding : 10
				}
			}),
			
			UUI.V_CENTER({
				style : {
					marginRight : 20,
					flt : 'right',
					width : 187,
					height : 30,
					fontWeight : 'bold',
					backgroundImage : DPlayInventory.R('smallbutton.png'),
					cursor : 'pointer',
					color : '#afada8',
					textAlign : 'center'
				},
				c : MSG('RUN_METHOD_CHANGE_GAS_BUTTON'),
				on : {
					tap : () => {
						
						let content = DIV({
							style : {
								textAlign : 'left'
							},
							c : [
							P({
								c : MSG('RUN_METHOD_CHANGE_GAS_DESCRIPTION')
							}),
							P({
								style : {
									marginTop : 10
								},
								c : [
									MSG('RUN_METHOD_CHANGE_GAS_AVERAGE') + ' : ' + gasPriceAverage + '\n',
									MSG('RUN_METHOD_CHANGE_GAS_MAX') + ' : ' + gasPriceFast
								]
							})]
						});
						
						DPlayInventory.Prompt({
							title : MSG('RUN_METHOD_CHANGE_GAS_TITLE'),
							content : content,
							value : gasPrice
						}, (_gasPrice) => {
							
							gasPrice = REAL(_gasPrice);
							
							gasPanel.empty();
							gasPanel.append(MSG('RUN_METHOD_GAS') + ' : ' + (gas * gasPrice / 1000000000) + ' Ether');
						});
					}
				}
			}),
			
			CLEAR_BOTH(),
			
			UUI.V_CENTER({
				style : {
					position : 'absolute',
					bottom : 85,
					left : '50%',
					marginLeft : -117,
					width : 234,
					height : 40,
					fontWeight : 'bold',
					backgroundImage : DPlayInventory.R('cartoon/seecartoon.png'),
					cursor : 'pointer',
					color : '#afada8',
					textAlign : 'center'
				},
				c : MSG('RUN_METHOD_GAS_INTRODUCE_BUTTON'),
				on : {
					tap : () => {
						DPlayInventory.Core.openGasCartoon();
					}
				}
			}),
			
			UUI.V_CENTER({
				style : {
					position : 'absolute',
					bottom : 20,
					left : '50%',
					marginLeft : -165,
					width : 330,
					height : 33,
					fontWeight : 'bold',
					backgroundImage : DPlayInventory.R('button.png'),
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
			
			iconPanel.addStyle({
				backgroundImage : info.favicon
			});
			
			descriptionPanel.append(MSG('RUN_METHOD_DESCRIPTION').replace(/{game}/, info.title));
			
			methodNamePanel.append(MSG('RUN_METHOD_METHOD_NAME') + ' : ' + info.methodName);
			
			methodParams = info.params;
			gas = info.gas;
			gasPriceAverage = info.gasPriceAverage;
			gasPriceFast = info.gasPriceFast;
			
			gasPrice = gasPriceAverage + (gasPriceFast - gasPriceAverage) / 10;
			
			gasPanel.append(MSG('RUN_METHOD_GAS') + ' : ' + (+(gas * gasPrice / 1000000000).toFixed(11)) + ' Ether');
		});
		
		inner.on('close', () => {
			wrapper.remove();
		});
	}
});