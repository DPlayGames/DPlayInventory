DPlayInventory.Guild = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let content = DIV({
			style : {
				position : 'relative',
				textAlign : 'center'
			},
			c : [A({
				style : {
					position : 'absolute',
					left : 12,
					top : 10
				},
				c : IMG({
					src : DPlayInventory.R('backbutton.png')
				}),
				on : {
					tap : () => {
						DPlayInventory.GO('');
					}
				}
			}),
			
			H1({
				style : {
					paddingTop : 40,
					fontWeight : 'bold',
					fontSize : 20
				},
				c : MSG('GUILD_INFO_TITLE')
			})]
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
						c : [
						H2({
							style : {
								marginTop : 30,
								fontWeight : 'bold'
							},
							c : MSG('GUILD_NAME')
						}),
						
						P({
							style : {
								padding : 20
							},
							c : guildData.name
						}),
						
						H2({
							style : {
								marginTop : 20,
								fontWeight : 'bold'
							},
							c : MSG('GUILD_INTRODUCE')
						}),
						
						P({
							style : {
								padding : 20
							},
							c : guildData.introduce
						}),
						
						// 길드장인 경우 메뉴 생성
						guildData.accountId !== accountId ? undefined : DIV({
							c : [
							
							UUI.V_CENTER({
								style : {
									margin : 'auto',
									marginTop : 30,
									width : 330,
									height : 33,
									backgroundImage : DPlayInventory.R('button.png'),
									textAlign : 'center',
									cursor : 'pointer',
									color : '#afada8',
									fontWeight : 'bold'
								},
								c : MSG('UPDATE_GUILD_BUTTON'),
								on : {
									tap : () => {
										DPlayInventory.GO('updateguild');
									}
								}
							}),
							
							UUI.V_CENTER({
								style : {
									margin : 'auto',
									marginTop : 10,
									width : 330,
									height : 33,
									backgroundImage : DPlayInventory.R('button.png'),
									textAlign : 'center',
									cursor : 'pointer',
									color : '#afada8',
									fontWeight : 'bold'
								},
								c : MSG('REMOVE_GUILD_BUTTON'),
								on : {
									tap : () => {
										
										DPlayInventory.Confirm({
											content : MSG('REMOVE_GUILD_CONFIRM') 
										}, () => {
											//TODO:
										});
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