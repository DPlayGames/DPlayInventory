DPlayInventory.SendItemPopup = CLASS({
	
	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.itemType
		//REQUIRED: params.addresses
		//REQUIRED: params.gameName
		//REQUIRED: params.itemName
		//REQUIRED: params.imageSrc
		//OPTIONAL: params.itemId
		
		let itemType = params.itemType;
		let addresses = params.addresses;
		let gameName = params.gameName;
		let itemName = params.itemName;
		let imageSrc = params.imageSrc;
		let itemId = params.itemId;
		
		let balancePanel;
		let amountInput;
		let accountIdInput;
		
		let modal = UUI.MODAL({
			style : {
				width : 297,
				height : 319,
				backgroundImage : DPlayInventory.R('senditempopup.png'),
				color : '#979b9b',
				boxShadow : '0 0 10px #000',
				textAlign : 'center'
			},
			c : [
			A({
				style : {
					position : 'absolute',
					right : 1,
					top : 1
				},
				c : IMG({
					src : DPlayInventory.R('x.png')
				}),
				on : {
					tap : () => {
						modal.close();
					}
				}
			}),
			
			H1({
				style : {
					fontWeight : 'bold',
					padding : 2
				},
				c : MSG('SEND_ITEM_TITLE').replace(/{game}/, gameName).replace(/{item}/, itemName)
			}),
			
			DIV({
				style : {
					margin : 'auto',
					marginTop : 14,
					width : 130,
					height : 130,
					backgroundImage : imageSrc,
					backgroundRepeat : 'no-repeat',
					backgroundPosition : 'center center',
					backgroundSize : 'contain'
				}
			}),
			
			balancePanel = P({
				style : {
					marginTop : itemType === 'ERC20' ? 13 : 23,
					color : '#f6f4e3',
					textShadow : DPlayInventory.TextBorderShadow('#403414')
				},
				c : IMG({
					src : DPlayInventory.R('textloading.gif')
				})
			}),
			
			FORM({
				c : [
				
				itemType === 'ERC20' ? amountInput = UUI.FULL_INPUT({
					style : {
						position : 'absolute',
						bottom : 84,
						left : '50%',
						marginLeft : -137.5,
						width : 263,
						border : '1px solid #abacad',
						backgroundColor : '#e6e2dd'
					},
					name : 'amount',
					placeholder : MSG('SEND_ITEM_COUNT_INPUT_PLACEHOLDER')
				}) : undefined,
				
				accountIdInput = UUI.FULL_INPUT({
					style : {
						position : 'absolute',
						bottom : 49,
						left : '50%',
						marginLeft : -137.5,
						width : 263,
						border : '1px solid #abacad',
						backgroundColor : '#e6e2dd'
					},
					name : 'accountId',
					placeholder : MSG('SEND_ITEM_ACCOUNT_ID_INPUT_PLACEHOLDER')
				}),
				
				UUI.FULL_SUBMIT({
					style : {
						position : 'absolute',
						bottom : 8,
						left : '50%',
						marginLeft : -137.5,
						width : 275,
						height : 33,
						fontWeight : 'bold',
						backgroundImage : DPlayInventory.R('dialogue/button.png'),
						cursor : 'pointer',
						color : '#afada8',
						backgroundColor : 'transparent'
					},
					inputStyle : {
						padding : 0
					},
					value : MSG('SEND_ITEM_SUBMIT')
				})],
				
				on : {
					submit : (e, form) => {
						
						let data = form.getData();
						
						if (itemType === 'ERC20') {
							
							let amount = INTEGER(data.amount);
							
							let loading = DPlayInventory.Loading();
							
							DPlayInventory.Core.getERC20Balance(addresses, (balance) => {
								loading.remove();
								
								if (amount > balance) {
									DPlayInventory.Alert({
										msg : MSG('NOT_ENOUGH_ITEM_COUNT_ALERT')
									});
								}
								
								else {
									
									let loading = DPlayInventory.Loading();
									
									DPlayInventory.Core.transferERC20({
										addresses : addresses,
										amount : amount,
										to : data.accountId
									}, {
										error : () => {
											loading.remove();
											
											DPlayInventory.Alert({
												msg : MSG('SEND_ITEM_ERROR_ALERT')
											});
										},
										
										success : () => {
											loading.remove();
											
											DPlayInventory.Alert({
												msg : MSG('SENT_ITEM_ALERT')
											});
										}
									});
								}
							});
						}
						
						else if (itemType === 'ERC721') {
							
							let loading = DPlayInventory.Loading();
							
							DPlayInventory.Core.getAccountId((accountId) => {
								
								DPlayInventory.Core.getERC721Owner({
									addresses : addresses,
									id : itemId
								}, (owner) => {
									
									loading.remove();
									
									if (owner !== accountId) {
										DPlayInventory.Alert({
											msg : MSG('NOT_OWNER_ERROR_ALERT')
										});
									}
									
									else {
										
										let loading = DPlayInventory.Loading();
										
										DPlayInventory.Core.transferERC721({
											addresses : addresses,
											id : itemId,
											to : data.accountId
										}, {
											error : () => {
												loading.remove();
												
												DPlayInventory.Alert({
													msg : MSG('SEND_ITEM_ERROR_ALERT')
												});
											},
											
											success : () => {
												loading.remove();
												
												DPlayInventory.Alert({
													msg : MSG('SENT_ITEM_ALERT')
												});
											}
										});
									}
								});
							});
						}
					}
				}
			})]
		});
		
		if (itemType === 'ERC20') {
			
			amountInput.select();
			
			DPlayInventory.Core.getERC20Balance(addresses, (balance) => {
				balancePanel.empty();
				balancePanel.append(MSG('ITEM_COUNT').replace(/{n}/, balance));
			});
		}
		
		else if (itemType === 'ERC721') {
			
			accountIdInput.select();
			
			balancePanel.empty();
			balancePanel.append(MSG('SPECIAL_ITEM'));
		}
	}
});
