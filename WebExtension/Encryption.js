OVERRIDE(DPlayInventory.Encryption, (origin) => {
	
	DPlayInventory.Encryption = OBJECT({
		
		init : (inner, self) => {
			
			let setPassword = self.setPassword = (password, callback) => {
				//REQUIRED: password
				//REQUIRED: callback
				
				chrome.runtime.sendMessage({
					methodName : 'setPassword',
					data : password
				}, callback);
			};
			
			let checkPasswordExists = self.checkPasswordExists = (callback) => {
				//REQUIRED: callback
				
				chrome.runtime.sendMessage({
					methodName : 'checkPasswordExists'
				}, callback);
			};
			
			let removePassword = self.removePassword = (callback) => {
				//REQUIRED: callback
				
				chrome.runtime.sendMessage({
					methodName : 'removePassword'
				}, callback);
			};
			
			let encrypt = self.encrypt = (text, callbackOrHandlers) => {
				//REQUIRED: text
				//REQUIRED: callbackOrHandlers
				//OPTIONAL: callbackOrHandlers.error
				//REQUIRED: callbackOrHandlers.success
				
				let errorHandler;
				let callback;
				
				if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
					callback = callbackOrHandlers;
				} else {
					errorHandler = callbackOrHandlers.error;
					callback = callbackOrHandlers.success;
				}
				
				chrome.runtime.sendMessage({
					methodName : 'encrypt',
					data : text
				}, (result) => {
					
					if (result.errorMsg !== undefined) {
						if (errorHandler !== undefined) {
							errorHandler(result.errorMsg);
						} else {
							SHOW_ERROR('DPlayInventory.Encryption', result.errorMsg);
						}
					}
					
					else {
						callback(result.encryptedText);
					}
				});
			};
			
			let decrypt = self.decrypt = (encryptedText, callbackOrHandlers) => {
				//REQUIRED: encryptedText
				//REQUIRED: callbackOrHandlers
				//OPTIONAL: callbackOrHandlers.error
				//REQUIRED: callbackOrHandlers.success
				
				let errorHandler;
				let callback;
				
				if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
					callback = callbackOrHandlers;
				} else {
					errorHandler = callbackOrHandlers.error;
					callback = callbackOrHandlers.success;
				}
				
				chrome.runtime.sendMessage({
					methodName : 'decrypt',
					data : encryptedText
				}, (result) => {
					
					if (result.errorMsg !== undefined) {
						if (errorHandler !== undefined) {
							errorHandler(result.errorMsg);
						} else {
							SHOW_ERROR('DPlayInventory.Encryption', result.errorMsg);
						}
					}
					
					else {
						callback(result.text);
					}
				});
			};
		}
	});
});