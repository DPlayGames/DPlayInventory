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
						c : '계정 생성'
					})]
				}),
				
				DIV({
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
						placeholder : '12개의 비밀 단어'
					}), UUI.FULL_INPUT({
						style : {
							marginTop : 10,
							borderRadius : 5
						},
						placeholder : '이 기기에서 사용할 비밀번호'
					}), A({
						style : {
							marginTop : 10,
							display : 'block',
							padding : '15px 0',
							backgroundColor : '#666',
							borderRadius : 10,
							textAlign : 'center'
						},
						c : '계정 복구'
					})]
				})]
			})]
		}).appendTo(BODY);
		
		inner.on('close', () => {
			wrapper.remove();
		});
	}
});