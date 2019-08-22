global.ViewControllerBackground = OBJECT({

	preset : () => {
		return WebExtensionBackground;
	},
	
	params : () => {
		return {
			backgroundName : 'ViewControllerBackground'
		};
	},

	init : (inner, self) => {
	}
});