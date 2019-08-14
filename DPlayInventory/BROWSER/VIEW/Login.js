DPlayInventory.Login = CLASS({

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
				c : []
			})]
		}).appendTo(BODY);
		
		inner.on('close', () => {
			wrapper.remove();
		});
	}
});