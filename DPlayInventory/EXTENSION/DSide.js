OVERRIDE(DPlayInventory.DSide, (origin) => {
	
	DPlayInventory.DSide = OBJECT({
		
		preset : () => {
			return WebExtensionForeground;
		},
		
		params : () => {
			return {
				backgroundName : 'DSideBackground'
			};
		},
		
		init : (inner, self) => {
			
		}
	});
});