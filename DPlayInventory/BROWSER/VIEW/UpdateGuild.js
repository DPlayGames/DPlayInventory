DPlayInventory.UpdateGuild = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let guildData;
		
		let form;
		let content = DIV({
			style : {
				position : 'relative'
			},
			c : [
			DPlayInventory.UseDNotice(1),
			
			H1({
				c : '길드 정보 수정'
			}),
			
			form = UUI.VALID_FORM({
				
				errorMsgs : {
					name : {
						notEmpty : '길드명을 입력해주세요.',
						size : (validParams) => {
							return '길드명은 ' + validParams.max + '글자 이하로 입력해주시기 바랍니다.';
						}
					},
					introduce : {
						size : (validParams) => {
							return '길드 소개는 ' + validParams.max + '글자 이하로 입력해주시기 바랍니다.';
						}
					}
				},
				errorMsgStyle : {
					marginTop : 5,
					color : 'red'
				},
				
				c : [
				// 길드명 입력
				UUI.FULL_INPUT({
					name : 'name',
					placeholder : '길드명'
				}),
				
				// 길드 소개 입력
				UUI.FULL_TEXTAREA({
					name : 'introduce',
					placeholder : '길드 소개'
				}),
				
				UUI.FULL_SUBMIT({
					value : '저장하기'
				})],
				on : {
					submit : (e, form) => {
						
						DPlayInventory.Confirm({
							msg : '1d를 소모하여 길드 정보를 수정하시겠습니까?'
						}, () => {
							
							let data = form.getData();
							
							guildData.name = data.name;
							guildData.introduce = data.introduce;
							guildData.lastUpdateTime = DPlayInventory.DSide.getNodeTime(new Date());
							
							DPlayInventory.SecureStore.signData(guildData, (hash) => {
								
								DPlayInventory.DSide.getGuildHash(guildData.id, (guildHash) => {
									
									DPlayInventory.DSide.updateGuild({
										originHash : guildHash,
										data : guildData,
										hash : hash
									}, (result) => {
										
										if (result.isNotEnoughD === true) {
											DPlayInventory.Alert({
												msg : 'd가 부족합니다.'
											});
										}
										
										else if (result.validErrors !== undefined) {
											form.showErrors(result.validErrors);
										}
										
										else if (result.isNotVerified === true) {
											DPlayInventory.Alert({
												msg : '유효하지 않은 데이터입니다.'
											});
										}
										
										else {
											DPlayInventory.GO('guild');
										}
									});
								});
							});
						});
					}
				}
			})]
		});
		
		// 기존 데이터를 가져옵니다.
		DPlayInventory.SecureStore.getAccountId((accountId) => {
			DPlayInventory.DSide.getAccountGuild(accountId, (_guildData) => {
				if (_guildData !== undefined) {
					guildData = _guildData;
					form.setData(guildData);
				}
			});
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inner.on('close', () => {
			content.remove();
		});
	}
});