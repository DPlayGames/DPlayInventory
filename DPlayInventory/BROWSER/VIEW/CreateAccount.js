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
				DIV({
					c : [
					H2({
						c : '당신의 계정 주소'
					}),
					P({
						c : wallet.getChecksumAddressString()
					})]
				}),
				
				DIV({
					c : [
					H2({
						c : '12개의 비밀 단어'
					}),
					P({
						c : mnemonic
					}),
					P({
						c : '절대! 결코! 반드시! 위 비밀 단어들을 백업하세요. 그리고 아무에게도 공개하지 마세요. 위 비밀 단어들을 아는 사람은 당신의 모든 디지털 자산을 훔쳐갈 수 있습니다.\n\n비밀 단어만 알고 있으면 계정 주소도 다시 알아낼 수 있습니다. 계정 주소는 백업 안해도 돼요.'
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
					c : '백업을 완료했습니다.',
					on : {
						tap : () => {
							
							DPlayInventory.Confirm({
								msg : '정말 백업 했어요? 백업을 하지 않아, 당신이 모든 자산을 잃어버려도 저희는 일체 책임지지 않습니다!'
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
					c : '다시 생성하기',
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