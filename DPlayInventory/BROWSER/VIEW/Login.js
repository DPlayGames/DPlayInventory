DPlayInventory.Login = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
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
				c : [UUI.FULL_INPUT({
					name : 'password',
					type : 'password',
					placeholder : '비밀번호'
				}), UUI.FULL_SUBMIT({
					style : {
						marginTop : 10,
						display : 'block',
						padding : '15px 0',
						backgroundColor : '#666',
						borderRadius : 10,
						textAlign : 'center'
					},
					value : '계정 접속'
				}), A({
					c : '비밀번호 재설정',
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
								msg : '비밀번호를 입력해주세요.'
							});
						}
						
						else if (password.length < 4) {
							DPlayInventory.Alert({
								msg : '비밀번호가 너무 짧습니다. 4글자 이상으로 입력해주세요.'
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
												msg : '비밀번호가 틀렸습니다.'
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
		
		inner.on('close', () => {
			wrapper.remove();
		});
	}
});