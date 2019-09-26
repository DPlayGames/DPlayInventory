DPlayInventory.RestoreAccount = CLASS({

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
			DIV({
				style : {
					width : 300,
					margin : 'auto'
				},
				c : [DIV({
					c : [H2({
						style : {
							textAlign : 'center'
						},
						c : MSG('FIRST_USE_CONFIRM')
					}), A({
						style : {
							marginTop : 10,
							display : 'block',
							padding : '15px 0',
							backgroundColor : '#666',
							borderRadius : 10,
							textAlign : 'center'
						},
						c : MSG('CREATE_ACCOUNT_BUTTON'),
						on : {
							tap : () => {
								DPlayInventory.GO('createaccount');
							}
						}
					})]
				}),
				
				FORM({
					style : {
						marginTop : 20
					},
					c : [H2({
						style : {
							textAlign : 'center'
						},
						c : MSG('ALREADY_HAVE_ACCOUNT_CONFIRM')
					}), UUI.FULL_TEXTAREA({
						style : {
							marginTop : 10,
							borderRadius : 5
						},
						name : 'mnemonic',
						placeholder : MSG('MNEMONIC')
					}), UUI.FULL_INPUT({
						style : {
							marginTop : 10,
							borderRadius : 5
						},
						name : 'password',
						type : 'password',
						placeholder : MSG('THIS_DEVICE_PASSWORD_INPUT')
					}), P({
						c : MSG('PASSWORD_NOTICE')
					}), UUI.FULL_SUBMIT({
						style : {
							marginTop : 10,
							display : 'block',
							padding : '15px 0',
							backgroundColor : '#666',
							borderRadius : 10,
							textAlign : 'center'
						},
						value : MSG('RESTORE_ACCOUNT_SUBMIT')
					})],
					on : {
						submit : (e, form) => {
							
							let data = form.getData();
							let mnemonic = data.mnemonic.trim();
							let password = data.password.trim();
							
							if (mnemonic === '') {
								DPlayInventory.Alert({
									msg : MSG('PLEASE_ENTER_MNEMONIC_MESSAGE')
								});
							}
							
							else if (password === '') {
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
									
									let seed = bip39.mnemonicToSeed(mnemonic);
									
									let rootKey = ethereumjs.WalletHD.fromMasterSeed(seed);
									let hardenedKey = rootKey.derivePath('m/44\'/60\'/0\'/0');
									let childKey = hardenedKey.deriveChild(0);
									
									let wallet = childKey.getWallet();
									
									NEXT([
									(next) => {
										DPlayInventory.SecureStore.saveAccountId(wallet.getChecksumAddressString(), next);
									},
									
									(next) => {
										return () => {
											DPlayInventory.SecureStore.savePrivateKey(wallet.getPrivateKeyString().substring(2).toUpperCase(), next);
										};
									},
									
									() => {
										return () => {
											
											loading.remove();
											
											DPlayInventory.GO('login');
										};
									}]);
								});
							}
						}
					}
				})]
			})]
		}).appendTo(BODY);
		
		inner.on('close', () => {
			wrapper.remove();
		});
	}
});