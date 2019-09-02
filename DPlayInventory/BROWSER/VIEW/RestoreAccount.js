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
						c : 'DPlay 보관함을 처음 이용하십니까?'
					}), A({
						style : {
							marginTop : 10,
							display : 'block',
							padding : '15px 0',
							backgroundColor : '#666',
							borderRadius : 10,
							textAlign : 'center'
						},
						c : '계정 생성',
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
						c : '이전에 계정을 생성하신 적이 있습니까?'
					}), UUI.FULL_TEXTAREA({
						style : {
							marginTop : 10,
							borderRadius : 5
						},
						name : 'mnemonic',
						placeholder : '12개의 비밀 단어'
					}), UUI.FULL_INPUT({
						style : {
							marginTop : 10,
							borderRadius : 5
						},
						name : 'password',
						type : 'password',
						placeholder : '이 기기에서 사용할 비밀번호'
					}), P({
						c : '위 비밀번호는 매번 12개의 비밀 단어를 입력하지 않도록 하는 단순한 편의 기능으로, 비밀번호와 무관하게 12개의 비밀 단어들은 반드시 백업해야합니다.'
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
					})],
					on : {
						submit : (e, form) => {
							
							let data = form.getData();
							let mnemonic = data.mnemonic.trim();
							let password = data.password.trim();
							
							if (mnemonic === '') {
								DPlayInventory.Alert({
									msg : '12개의 비밀 단어를 입력해주세요.'
								});
							}
							
							else if (password === '') {
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
									
									let seed = bip39.mnemonicToSeed(mnemonic);
									
									let rootKey = ethereumjs.WalletHD.fromMasterSeed(seed);
									let hardenedKey = rootKey.derivePath('m/44\'/60\'/0\'/0');
									let childKey = hardenedKey.deriveChild(0);
									
									let wallet = childKey.getWallet();
									
									let encryptedAccountId;
									let encryptedPrivateKey;
									
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