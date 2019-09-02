DPlayInventory.UseDNotice = CLASS({

	preset : () => {
		return DIV;
	},
	
	init : (inner, self, d) => {
		//REQUIRED: d
		
		self.append('이하 작업에는 ' + d + 'd가 소모됩니다.');
	}
});
