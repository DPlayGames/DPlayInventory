DPlayInventory('Popup').Login = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let passwordInput;
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
				c : MSG('LOGIN_TITLE')
			}),
			
			FORM({
				style : {
					width : 275,
					margin : 'auto'
				},
				c : [
				
				// 로고
				H1({
					style : {
						marginTop : 36,
						marginLeft : -10,
						color : '#707474',
						fontWeight : 'bold',
						textAlign : 'center',
						fontSize : 20
					},
					c : [MSG('TITLE').substring(0, MSG('TITLE').indexOf('DPlay')), IMG({
						style : {
							marginBottom : -15
						},
						src : DPlayInventory.R('dplay.png')
					}), MSG('TITLE').substring(MSG('TITLE').indexOf('DPlay') + 5)]
				}),	
				
				passwordInput = UUI.FULL_INPUT({
					style : {
						position : 'absolute',
						bottom : 80,
						left : '50%',
						marginLeft : -137.5,
						width : 263,
						border : '1px solid #abacad',
						backgroundColor : '#e6e2dd'
					},
					name : 'password',
					type : 'password',
					placeholder : MSG('LOGIN_PASSWORD_INPUT')
				}),
				
				UUI.FULL_SUBMIT({
					style : {
						position : 'absolute',
						bottom : 38,
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
					value : MSG('LOGIN_SUBMIT')
				}),
				
				DIV({
					style : {
						position : 'absolute',
						bottom : 18,
						left : '50%',
						marginLeft : -137.5,
						width : 275,
						textAlign : 'right',
						fontSize : 12
					},
					c : A({
						c : MSG('RESET_PASSWORD_BUTTON'),
						on : {
							tap : () => {
								
								DPlayInventory.GO('restoreaccount');
							}
						}
					})
				})],
				on : {
					submit : (e, form) => {
						
						let data = form.getData();
						let password = data.password.trim();
						
						if (password === '') {
							DPlayInventory.Alert({
								content : MSG('PLEASE_ENTER_PASSWORD_MESSAGE')
							});
						}
						
						else if (password.length < 4) {
							DPlayInventory.Alert({
								content : MSG('PASSWORD_TOO_SHORT_MESSAGE')
							});
						}
						
						else {
							
							let loading = DPlayInventory.Loading();
							
							DPlayInventory.Core.setPassword(password, () => {
								
								DPlayInventory.Core.getAccountId((accountId) => {
									
									if (accountId === undefined) {
										
										DPlayInventory.Core.removePassword(() => {
											loading.remove();
											
											DPlayInventory.Alert({
												content : MSG('WRONG_PASSWORD_MESSAGE')
											});
										});
									}
									
									else {
										
										DPlayInventory.Core.loginCallback();
										close();
									}
								});
							});
						}
					}
				}
			})]
		}).appendTo(BODY);
		
		passwordInput.select();
		
		inner.on('close', () => {
			wrapper.remove();
		});
	}
});