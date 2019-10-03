DPlayInventory.UseDNotice = CLASS({

	preset : () => {
		return DIV;
	},
	
	init : (inner, self, d) => {
		//REQUIRED: d
		
		self.append(P({
			style : {
				padding : 20
			},
			c : MSG('USE_D_MESSAGE').replace(/{d}/, d)
		}));
	}
});
