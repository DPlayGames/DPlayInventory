DPlayInventory.CreateGuild = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let form;
		let content = DIV({
			style : {
				position : 'relative'
			},
			c : [
			DPlayInventory.UseDNotice(20),
			
			H1({
				c : MSG('CREATE_GUILD_TITLE')
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
					value : MSG('CREATE_GUILD_SUBMIT')
				})],
				on : {
					submit : (e, form) => {
						
						DPlayInventory.Confirm({
							msg : MSG('CREATE_GUILD_CONFIRM')
						}, () => {
							
							let data = form.getData();
							data.id = UUID();
							data.createTime = DPlayInventory.DSide.getNodeTime(new Date());
							
							DPlayInventory.Core.getAccountId((accountId) => {
								data.accountId = accountId;
								data.memberIds = [accountId];
								
								DPlayInventory.Core.signData(data, (hash) => {
									
									DPlayInventory.DSide.createGuild({
										hash : hash,
										data : data
									}, (result) => {
										
										if (result.isNotEnoughD === true) {
											DPlayInventory.Alert({
												msg : MSG('NOT_ENOUGH_D_MESSAGE')
											});
										}
										
										else if (result.validErrors !== undefined) {
											form.showErrors(result.validErrors);
										}
										
										else if (result.isNotVerified === true) {
											DPlayInventory.Alert({
												msg : MSG('NOT_VERIFIED_MESSAGE')
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
		
		DPlayInventory.Layout.setContent(content);
		
		inner.on('close', () => {
			content.remove();
		});
	}
});