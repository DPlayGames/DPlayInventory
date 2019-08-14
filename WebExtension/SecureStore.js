OVERRIDE(DPlayInventory.SecureStore, (origin) => {
	
	DPlayInventory.SecureStore = OBJECT({
	
		init : (inner, self) => {
			
			let save = self.save = (params, callback) => {
				//REQUIRED: params
				//REQUIRED: params.name
				//REQUIRED: params.value
				//REQUIRED: callback
				
				let name = params.name;
				let value = params.value;
				
				let data = {};
				data[name] = value;
				
				chrome.storage.local.set(data, callback);
			};
			
			let get = self.get = (name, callback) => {
				//REQUIRED: name
				//REQUIRED: callback
				
				chrome.storage.local.get([name], (result) => {
					callback(result[name]);
				});
			};
			
			let clear = self.clear = (callback) => {
				//REQUIRED: callback
				
				chrome.storage.local.clear(callback);
			};
		}
	});
});