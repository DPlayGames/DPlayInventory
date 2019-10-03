DPlayInventory('Popup').RestoreAccount = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
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
			
			// 계정 생성
			DIV({
				style : {
					width : 330,
					margin : 'auto',
					paddingBottom : 30
				},
				c : [DIV({
					c : [H2({
						style : {
							textAlign : 'center'
						},
						c : MSG('FIRST_USE_CONFIRM')
					}), UUI.V_CENTER({
						style : {
							marginTop : 10,
							width : 330,
							height : 33,
							backgroundImage : DPlayInventory.R('redbutton.png'),
							textAlign : 'center',
							cursor : 'pointer',
							color : '#afada8',
							fontWeight : 'bold'
						},
						c : MSG('CREATE_ACCOUNT_BUTTON'),
						on : {
							tap : () => {
								DPlayInventory.GO('popup/createaccount');
							}
						}
					})]
				}),
				
				FORM({
					style : {
						marginTop : 40
					},
					c : [H2({
						style : {
							textAlign : 'center'
						},
						c : MSG('ALREADY_HAVE_ACCOUNT_CONFIRM')
					}), UUI.FULL_TEXTAREA({
						style : {
							marginTop : 10,
							border : '1px solid #abacad',
							backgroundColor : '#e6e2dd'
						},
						name : 'mnemonic',
						placeholder : MSG('MNEMONIC')
					}), UUI.FULL_INPUT({
						style : {
							marginTop : 10,
							border : '1px solid #abacad',
							backgroundColor : '#e6e2dd'
						},
						name : 'password',
						type : 'password',
						placeholder : MSG('THIS_DEVICE_PASSWORD_INPUT')
					}), P({
						style : {
							marginTop : 25
						},
						c : MSG('PASSWORD_NOTICE')
					}),
					
					// 계정 생성 버튼
					UUI.FULL_SUBMIT({
						style : {
							position : 'absolute',
							bottom : 22,
							left : '50%',
							marginLeft : -165,
							width : 330,
							height : 33,
							backgroundImage : DPlayInventory.R('button.png'),
							textAlign : 'center',
							cursor : 'pointer',
							color : '#afada8',
							fontWeight : 'bold',
							backgroundColor : 'transparent'
						},
						inputStyle : {
							padding : 0
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
									content : MSG('PLEASE_ENTER_MNEMONIC_MESSAGE')
								});
							}
							
							else if (password === '') {
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
									
									let seed = bip39.mnemonicToSeed(mnemonic);
									
									let rootKey = ethereumjs.WalletHD.fromMasterSeed(seed);
									let hardenedKey = rootKey.derivePath('m/44\'/60\'/0\'/0');
									let childKey = hardenedKey.deriveChild(0);
									
									let wallet = childKey.getWallet();
									
									NEXT([
									(next) => {
										DPlayInventory.Core.saveAccountId(wallet.getChecksumAddressString(), next);
									},
									
									(next) => {
										return () => {
											DPlayInventory.Core.savePrivateKey(wallet.getPrivateKeyString().substring(2).toUpperCase(), next);
										};
									},
									
									() => {
										return () => {
											
											DPlayInventory.DSide.login();
											
											DPlayInventory.Core.loginCallback();
											close();
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