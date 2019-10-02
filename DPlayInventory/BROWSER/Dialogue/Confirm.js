DPlayInventory.Confirm = CLASS({

	preset : () => {
		return UUI.CONFIRM;
	},

	params : () => {
		
		return {
			
			style : {
				width : 340,
				height : 240,
				backgroundImage : DPlayInventory.R('dialogue/background.png'),
				color : '#979b9b',
				boxShadow : '0 0 10px #000'
			},
			
			okButtonStyle : {
				position : 'absolute',
				bottom : 5,
				left : 5,
				width : 163,
				height : 27,
				paddingTop : 6,
				fontWeight : 'bold',
				backgroundImage : DPlayInventory.R('dialogue/okbutton.png')
			},
			
			cancelButtonStyle : {
				position : 'absolute',
				bottom : 5,
				right : 5,
				width : 163,
				height : 27,
				paddingTop : 6,
				fontWeight : 'bold',
				backgroundImage : DPlayInventory.R('dialogue/cancelbutton.png')
			}
		};
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.content
		
		let content = params.content;
		
		self.append(H3({
			style : {
				padding : 2,
				fontWeight : 'bold'
			},
			c : MSG('CONFIRM_TITLE')
		}));
		
		self.append(UUI.V_CENTER({
			style : {
				height : 173
			},
			c : P({
				style : {
					padding : 10
				},
				c : content
			})
		}));
	}
});
