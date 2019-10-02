DPlayInventory.Prompt = CLASS({

	preset : () => {
		return UUI.PROMPT;
	},

	params : () => {
		
		return {
			
			style : {
				width : 410,
				height : 345,
				backgroundImage : '/Delight/R/ui/dialogue/popup.png',
				fontSize : 15,
				color : '#c6beaf',
				fontWeight : 'bold',
				boxShadow : '0 0 10px #000'
			},
			
			inputStyle : {
				position : 'absolute',
				bottom : 62,
				left : 17,
				width : 369,
				height : 13,
				padding : 3,
				backgroundColor : 'transparent',
				backgroundImage : '/Delight/R/ui/dialogue/input.png',
				fontSize : 12,
				fontWeight : 'normal'
			},
			
			okButtonStyle : {
				position : 'absolute',
				bottom : 9,
				left : 10,
				width : 193,
				height : 30,
				paddingTop : 11,
				textShadow : SkyEngine.TextBorderShadow('#351106'),
				backgroundImage : '/Delight/R/ui/dialogue/okbutton.png'
			},
			
			cancelButtonStyle : {
				position : 'absolute',
				bottom : 9,
				right : 10,
				width : 193,
				height : 30,
				paddingTop : 11,
				textShadow : SkyEngine.TextBorderShadow('#351106'),
				backgroundImage : '/Delight/R/ui/dialogue/cancelbutton.png'
			}
		};
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.title
		//REQUIRED: params.content
		
		let title = params.title;
		let content = params.content;
		
		let gameStore = Delight.STORE('gameStore');
		
		self.append(H3({
			style : {
				marginTop : 10,
				fontWeight : 'bold',
				textShadow : SkyEngine.TextBorderShadow('#351106')
			},
			c : title
		}));
		
		self.append(P({
			style : {
				textAlign : 'left',
				color : '#7b7771',
				fontSize : 14,
				padding : '8px 20px',
				lineHeight : '2em'
			},
			c : content
		}));
		
		self.getOkButton().on('touchstart', () => {
			
			SOUND_ONCE({
				ogg : '/Delight/R/sfx/buttonpositive.ogg',
				mp3 : '/Delight/R/sfx/buttonpositive.mp3',
				volume : gameStore.get('soundVolume')
			});
		});
		
		self.getCancelButton().on('touchstart', () => {
			
			SOUND_ONCE({
				ogg : '/Delight/R/sfx/buttonnegative.ogg',
				mp3 : '/Delight/R/sfx/buttonnegative.mp3',
				volume : gameStore.get('soundVolume')
			});
		});
	}
});
