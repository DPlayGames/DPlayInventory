DPlayInventory.UseDNotice = CLASS({

	preset : () => {
		return DIV;
	},
	
	init : (inner, self, d) => {
		//REQUIRED: d
		
		self.append(MSG('USE_D_MESSAGE').replace(/{d}/, d));
	}
});
