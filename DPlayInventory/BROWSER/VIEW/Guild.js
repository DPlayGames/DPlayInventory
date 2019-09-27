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
		
		DPlayInventory.Core.getAccountId((accountId) => {
			DPlayInventory.DSide.getAccountGuild(accountId, (guildData) => {
				
				// 가입한 길드가 없는 경우
				if (guildData === undefined) {
					content.append(DIV({
						c : [P({
							c : MSG('NOT_EXISTS_GUILD_MESSAGE')
						}), UUI.BUTTON({
							c : MSG('CREATE_GUILD_BUTTON'),
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
								c : MSG('UPDATE_GUILD_BUTTON'),
								on : {
									tap : () => {
										DPlayInventory.GO('updateguild');
									}
								}
							}), UUI.BUTTON({
								c : MSG('REMOVE_GUILD_BUTTON'),
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