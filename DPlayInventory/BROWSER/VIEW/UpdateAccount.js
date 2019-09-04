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
						notEmpty : '이름을 입력해주세요.',
						size : (validParams) => {
							return '이름은 ' + validParams.max + '글자 이하로 입력해주시기 바랍니다.';
						}
					},
					introduce : {
						size : (validParams) => {
							return '자기 소개는 ' + validParams.max + '글자 이하로 입력해주시기 바랍니다.';
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
					placeholder : '이름'
				}),
				
				// 자기 소개 입력
				UUI.FULL_TEXTAREA({
					name : 'introduce',
					placeholder : '자기 소개'
				}),
				
				UUI.FULL_SUBMIT({
					value : '저장하기'
				})],
				on : {
					submit : (e, form) => {
						
						DPlayInventory.Confirm({
							msg : '1d를 소모하여 계정 정보를 수정하시겠습니까?'
						}, () => {
							
							let data = form.getData();
							data.createTime = DPlayInventory.DSide.getNodeTime(new Date());
							
							DPlayInventory.SecureStore.getAccountId((accountId) => {
								data.accountId = accountId;
								
								DPlayInventory.SecureStore.signData(data, (hash) => {
									
									DPlayInventory.DSide.saveAccountDetail({
										hash : hash,
										data : data
									}, {
										
										notValid : (validErrors) => {
											form.showErrors(validErrors);
										},
										
										notVerified : () => {
											DPlayInventory.Alert({
												msg : '유효하지 않은 데이터입니다.'
											});
										},
										
										notEnoughD : () => {
											DPlayInventory.Alert({
												msg : 'd가 부족합니다.'
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
		DPlayInventory.SecureStore.getAccountId((accountId) => {
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