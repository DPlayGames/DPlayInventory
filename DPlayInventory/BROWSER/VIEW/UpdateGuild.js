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
				c : MSG('UPDATE_GUILD_TITLE')
			}),
			
			form = UUI.VALID_FORM({
				
				errorMsgs : {
					name : {
						notEmpty : MSG('PLEASE_ENTER_GUILD_NAME_MESSAGE'),
						size : (validParams) => {
							return MSG('WRONG_SIZE_GUILD_NAME_MESSAGE').replace(/{length}/, validParams.max);
						}
					},
					introduce : {
						size : (validParams) => {
							return MSG('WRONG_SIZE_GUILD_INTRODUCE_MESSAGE').replace(/{length}/, validParams.max);
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
					placeholder : MSG('GUILD_NAME_INPUT')
				}),
				
				// 길드 소개 입력
				UUI.FULL_TEXTAREA({
					name : 'introduce',
					placeholder : MSG('GUILD_INTRODUCE_INPUT')
				}),
				
				UUI.FULL_SUBMIT({
					value : MSG('UPDATE_GUILD_SUBMIT')
				})],
				on : {
					submit : (e, form) => {
						
						DPlayInventory.Confirm({
							content : MSG('UPDATE_GUILD_CONFIRM')
						}, () => {
							
							let data = form.getData();
							
							guildData.name = data.name;
							guildData.introduce = data.introduce;
							guildData.lastUpdateTime = DPlayInventory.DSide.getNodeTime(new Date());
							
							DPlayInventory.Core.signData(guildData, (hash) => {
								
								DPlayInventory.DSide.getGuildHash(guildData.id, (guildHash) => {
									
									DPlayInventory.DSide.updateGuild({
										originHash : guildHash,
										data : guildData,
										hash : hash
									}, (result) => {
										
										if (result.isNotEnoughD === true) {
											DPlayInventory.Alert({
												content : MSG('NOT_ENOUGH_D_MESSAGE')
											});
										}
										
										else if (result.validErrors !== undefined) {
											form.showErrors(result.validErrors);
										}
										
										else if (result.isNotVerified === true) {
											DPlayInventory.Alert({
												content : MSG('NOT_VERIFIED_MESSAGE')
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
		DPlayInventory.Core.getAccountId((accountId) => {
			DPlayInventory.DSide.getAccountGuildId(accountId, (guildId) => {
				DPlayInventory.DSide.getGuild(guildId, (_guildData) => {
					
					if (_guildData !== undefined) {
						guildData = _guildData;
						form.setData(guildData);
					}
				});
			});
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inner.on('close', () => {
			content.remove();
		});
	}
});