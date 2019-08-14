DPlayInventory.Loading = CLASS({

	preset : () => {
		return UUI.LOADING;
	},

	params : () => {

		return {
			style : {
				backgroundColor : 'rgba(0, 0, 0, 0.5)',
				width : '100%',
				height : '100%'
			},
			contentStyle : {
				height : '100%'
			},
			msg : 'Loading...'
		};
	}
});
