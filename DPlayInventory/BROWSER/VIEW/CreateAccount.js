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
				width : 370,
				height : 550,
				backgroundColor : '#1e1e1e'
			},
			c : DIV({
				style : {
					width : 300,
					margin : 'auto'
				},
				c : [
				H1({
					c : MSG('CREATE_ACCOUNT_TITLE')
				}),
				
				DIV({
					c : [
					H2({
						c : MSG('CREATED_ACCOUNT_ID')
					}),
					P({
						c : wallet.getChecksumAddressString()
					})]
				}),
				
				DIV({
					c : [
					H2({
						c : MSG('MNEMONIC')
					}),
					P({
						c : mnemonic
					}),
					P({
						c : MSG('BACKUP_NOTICE_1') + '\n\n' + MSG('BACKUP_NOTICE_2')
					})]
				}),
				
				A({
					style : {
						marginTop : 10,
						display : 'block',
						padding : '15px 0',
						backgroundColor : '#666',
						borderRadius : 10,
						textAlign : 'center'
					},
					c : MSG('DONE_BACKUP_BUTTON'),
					on : {
						tap : () => {
							
							DPlayInventory.Confirm({
								msg : MSG('REALLY_BACKUP_CONFIRM')
							}, () => {
								DPlayInventory.GO('restoreaccount');
							});
						}
					}
				}),
				
				A({
					style : {
						marginTop : 10,
						display : 'block',
						padding : '15px 0',
						backgroundColor : '#666',
						borderRadius : 10,
						textAlign : 'center'
					},
					c : MSG('REGENERATE_ACCOUNT_BUTTON'),
					on : {
						tap : () => {
							REFRESH();
						}
					}
				})]
			})
		}).appendTo(BODY);
		
		inner.on('close', () => {
			wrapper.remove();
		});
	}
});