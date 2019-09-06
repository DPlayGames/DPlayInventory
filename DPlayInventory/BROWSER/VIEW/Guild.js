DPlayInventory.Guild = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let content = DIV({
			style : {
				position : 'relative'
			},
			c : []
		});
		
		DPlayInventory.SecureStore.getAccountId((accountId) => {
			DPlayInventory.DSide.getAccountGuild(accountId, (guildData) => {
				
				// 가입한 길드가 없는 경우
				if (guildData === undefined) {
					content.append(DIV({
						c : [P({
							c : '가입한 길드가 없습니다. 길드를 생성하시겠습니까?'
						}), UUI.BUTTON({
							c : '길드 생성',
							on : {
								tap : () => {
									DPlayInventory.GO('createguild');
								}
							}
						})]
					}));
				}
				
				else {
					
					content.append(DIV({
						c : [H3({
							c : guildData.name
						}), P({
							c : guildData.introduce
						}),
						
						// 길드장인 경우 메뉴 생성
						guildData.accountId !== accountId ? undefined : DIV({
							c : [UUI.BUTTON({
								c : '길드 정보 수정',
								on : {
									tap : () => {
										DPlayInventory.GO('updateguild');
									}
								}
							}), UUI.BUTTON({
								c : '길드 폐쇄',
								on : {
									tap : () => {
										DPlayInventory.GO('removeguild');
									}
								}
							})]
						})]
					}));
				}
			});
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inner.on('close', () => {
			content.remove();
		});
	}
});