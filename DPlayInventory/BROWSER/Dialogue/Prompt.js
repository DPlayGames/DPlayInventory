DPlayInventory.Prompt = CLASS({

	preset : () => {
		return UUI.PROMPT;
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
			
			inputStyle : {
				margin : 'auto',
				width : 318,
				border : '1px solid #abacad',
				backgroundColor : '#e6e2dd'
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
		//OPTIONAL: params.title
		//REQUIRED: params.content
		
		let title = params.title;
		let content = params.content;
		
		self.append(H3({
			style : {
				padding : 2,
				fontWeight : 'bold'
			},
			c : title === undefined ? MSG('PROMPT_TITLE') : title
		}));
		
		self.append(UUI.V_CENTER({
			style : {
				height : 144
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
