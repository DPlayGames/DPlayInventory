DPlayInventory.CreateAccount = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let mnemonic = bip39.generateMnemonic();
		
		let seed = bip39.mnemonicToSeed(mnemonic);
		
		let rootKey = ethereumjs.WalletHD.fromMasterSeed(seed);
		let hardenedKey = rootKey.derivePath('m/44\'/60\'/0\'/0');
		let childKey = hardenedKey.deriveChild(0);
		
		let wallet = childKey.getWallet();
		
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
			
			DIV({
				style : {
					width : 330,
					margin : 'auto',
					paddingBottom : 80
				},
				c : [
				
				H2({
					style : {
						fontWeight : 'bold',
						fontSize : 20,
						textAlign : 'center'
					},
					c : MSG('CREATE_ACCOUNT_TITLE')
				}),
				
				DIV({
					style : {
						marginTop : 30
					},
					c : [
					H3({
						style : {
							color : '#980100',
							fontWeight : 'bold'
						},
						c : MSG('CREATED_ACCOUNT_ID')
					}),
					P({
						style : {
							color : '#c2c0bd',
							fontWeight : 'bold',
							fontSize : 13
						},
						c : wallet.getChecksumAddressString()
					})]
				}),
				
				DIV({
					style : {
						marginTop : 20
					},
					c : [
					H3({
						style : {
							color : '#980100',
							fontWeight : 'bold'
						},
						c : MSG('MNEMONIC')
					}),
					P({
						style : {
							color : '#c2c0bd',
							fontWeight : 'bold'
						},
						c : mnemonic
					}),
					P({
						style : {
							marginTop : 20
						},
						c : MSG('BACKUP_NOTICE_1') + '\n\n' + MSG('BACKUP_NOTICE_2')
					})]
				}),
				
				// 하단 버튼들
				DIV({
					style : {
						position : 'absolute',
						bottom : 22,
						left : '50%',
						marginLeft : -165
					},
					c : [UUI.V_CENTER({
						style : {
							width : 330,
							height : 33,
							backgroundImage : DPlayInventory.R('button.png'),
							textAlign : 'center',
							cursor : 'pointer',
							color : '#afada8',
							fontWeight : 'bold'
						},
						c : MSG('DONE_BACKUP_BUTTON'),
						on : {
							tap : () => {
								
								DPlayInventory.Confirm({
									content : MSG('REALLY_BACKUP_CONFIRM')
								}, () => {
									DPlayInventory.GO('restoreaccount');
								});
							}
						}
					}),
					
					UUI.V_CENTER({
						style : {
							marginTop : 10,
							width : 330,
							height : 33,
							backgroundImage : DPlayInventory.R('button.png'),
							textAlign : 'center',
							cursor : 'pointer',
							color : '#afada8',
							fontWeight : 'bold'
						},
						c : MSG('REGENERATE_ACCOUNT_BUTTON'),
						on : {
							tap : () => {
								REFRESH();
							}
						}
					})]
				})]
			})]
		}).appendTo(BODY);
		
		inner.on('close', () => {
			wrapper.remove();
		});
	}
});