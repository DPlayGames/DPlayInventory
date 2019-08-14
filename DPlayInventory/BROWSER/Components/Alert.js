DPlayInventory.Alert = CLASS({

	preset : () => {
		return UUI.ALERT;
	},

	params : () => {

		return {
			style : {
				backgroundColor : '#fff',
				color : '#333',
				textAlign : 'center',
				border : '1px solid #333',
				borderRadius : 5,
				boxShadow : '0 0 5px rgba(0,0,0,0.3)',
				onDisplayResize : (width, height) => {
					if (width > 300) {
						return {
							width : 280
						};
					} else {
						return {
							width : '90%'
						};
					}
				}
			},
			contentStyle : {
				padding : 20
			},
			buttonStyle : {
				borderTop : '1px solid #999',
				padding : 15
			}
		};
	}
});
