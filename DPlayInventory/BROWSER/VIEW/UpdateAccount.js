DPlayInventory.UpdateAccount = CLASS({

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
			DPlayInventory.UseDNotice(1),
			
			form = UUI.VALID_FORM({
				
				errorMsgs : {
					name : {
						notEmpty : MSG('PLEASE_ENTER_NAME_MESSAGE'),
						size : (validParams) => {
							return MSG('WRONG_SIZE_NAME_MESSAGE').replace(/{length}/, validParams.max);
						}
					},
					introduce : {
						size : (validParams) => {
							return MSG('WRONG_SIZE_INTRODUCE_MESSAGE').replace(/{length}/, validParams.max);
						}
					}
				},
				errorMsgStyle : {
					marginTop : 5,
					color : 'red'
				},
				
				c : [
				// 이름 입력
				UUI.FULL_INPUT({
					name : 'name',
					placeholder : MSG('NAME_INPUT')
				}),
				
				// 자기 소개 입력
				UUI.FULL_TEXTAREA({
					name : 'introduce',
					placeholder : MSG('INTRODUCE_INPUT')
				}),
				
				UUI.FULL_SUBMIT({
					value : MSG('UPDATE_ACCOUNT_SUBMIT')
				})],
				on : {
					submit : (e, form) => {
						
						DPlayInventory.Confirm({
							content : MSG('UPDATE_ACCOUNT_CONFIRM')
						}, () => {
							
							let data = form.getData();
							data.createTime = DPlayInventory.DSide.getNodeTime(new Date());
							
							DPlayInventory.Core.getAccountId((accountId) => {
								data.accountId = accountId;
								
								DPlayInventory.Core.signData(data, (hash) => {
									
									DPlayInventory.DSide.saveAccountDetail({
										hash : hash,
										data : data
									}, {
										
										notValid : (validErrors) => {
											form.showErrors(validErrors);
										},
										
										notVerified : () => {
											DPlayInventory.Alert({
												content : MSG('NOT_VERIFIED_MESSAGE')
											});
										},
										
										notEnoughD : () => {
											DPlayInventory.Alert({
												content : MSG('NOT_ENOUGH_D_MESSAGE')
											});
										},
										
										success : () => {
											DPlayInventory.GO('account');
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
			DPlayInventory.DSide.getAccountDetail(accountId, (accountDetail) => {
				if (accountDetail !== undefined) {
					form.setData(accountDetail);
				}
			});
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inner.on('close', () => {
			content.remove();
		});
	}
});