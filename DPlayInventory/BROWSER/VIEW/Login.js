DPlayInventory.Login = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let passwordInput;
		let wrapper = UUI.V_CENTER({
			style : {
				position : 'relative',
				margin : 'auto',
				width : 370,
				height : 550,
				backgroundColor : '#1e1e1e'
			},
			c : [
			FORM({
				style : {
					width : 300,
					margin : 'auto'
				},
				c : [passwordInput = UUI.FULL_INPUT({
					name : 'password',
					type : 'password',
					placeholder : MSG('LOGIN_PASSWORD_INPUT')
				}), UUI.FULL_SUBMIT({
					style : {
						marginTop : 10,
						display : 'block',
						padding : '15px 0',
						backgroundColor : '#666',
						borderRadius : 10,
						textAlign : 'center'
					},
					value : MSG('LOGIN_SUBMIT')
				}), A({
					c : MSG('RESET_PASSWORD_BUTTON'),
					on : {
						tap : () => {
							
							DPlayInventory.GO('restoreaccount');
						}
					}
				})],
				on : {
					submit : (e, form) => {
						
						let data = form.getData();
						let password = data.password.trim();
						
						if (password === '') {
							DPlayInventory.Alert({
								msg : MSG('PLEASE_ENTER_PASSWORD_MESSAGE')
							});
						}
						
						else if (password.length < 4) {
							DPlayInventory.Alert({
								msg : MSG('PASSWORD_TOO_SHORT_MESSAGE')
							});
						}
						
						else {
							
							let loading = DPlayInventory.Loading();
							
							DPlayInventory.SecureStore.setPassword(password, () => {
								
								DPlayInventory.SecureStore.getAccountId({
									
									error : () => {
										
										DPlayInventory.SecureStore.removePassword(() => {
											loading.remove();
											
											DPlayInventory.Alert({
												msg : MSG('WRONG_PASSWORD_MESSAGE')
											});
										});
									},
									
									success : () => {
										loading.remove();
										
										DPlayInventory.GO('');
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