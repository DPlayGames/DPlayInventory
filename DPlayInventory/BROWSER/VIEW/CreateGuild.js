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
				c : '길드 생성'
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
							msg : '20d를 소모하여 길드를 생성하시겠습니까?'
						}, () => {
							
							let data = form.getData();
							data.id = UUID();
							data.createTime = DPlayInventory.DSide.getNodeTime(new Date());
							
							DPlayInventory.SecureStore.getAccountId((accountId) => {
								data.accountId = accountId;
								data.memberIds = [accountId];
								
								DPlayInventory.SecureStore.signData(data, (hash) => {
									
									DPlayInventory.DSide.createGuild({
										hash : hash,
										data : data
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
		
		DPlayInventory.Layout.setContent(content);
		
		inner.on('close', () => {
			content.remove();
		});
	}
});