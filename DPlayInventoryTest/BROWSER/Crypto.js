DPlayInventoryTest.Crypto = OBJECT({

	init: (inner, self) => {

		const HASH = 'SHA-256';
		const SALT = 'Code is Law';
		const ITERATRIONS = 1000;
		const KEY_LENGTH = 48;
		
		let getDerivation = (password, errorHandler, callback) => {
			
			let textEncoder = new TextEncoder('utf-8');
			let passwordBuffer = textEncoder.encode(password);
			
			crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveBits']).then((importedKey) => {
				
				crypto.subtle.deriveBits({
					name : 'PBKDF2',
					hash : HASH,
					salt : textEncoder.encode(SALT),
					iterations : ITERATRIONS
				}, importedKey, KEY_LENGTH * 8).then(callback).catch((error) => {
					errorHandler(error.toString());
				});
				
			}).catch((error) => {
				errorHandler(error.toString());
			});
		}

		let getKeyData = (derivation, errorHandler, callback) => {
			
			crypto.subtle.importKey('raw', derivation.slice(0, 32), {
				name : 'AES-CBC'
			}, false, ['encrypt', 'decrypt']).then((importedEncryptionKey) => {
				
				callback({
					key : importedEncryptionKey,
					iv : derivation.slice(32)
				});
				
			}).catch((error) => {
				errorHandler(error.toString());
			});
		}

		let encryptData = (text, password, errorHandler, callback) => {
			
			getDerivation(password, errorHandler, (derivation) => {
				getKeyData(derivation, errorHandler, (keyData) => {
					
					let textEncoder = new TextEncoder('utf-8');
					let textBuffer = textEncoder.encode(text);
					
					crypto.subtle.encrypt({
						name : 'AES-CBC',
						iv : keyData.iv
					}, keyData.key, textBuffer).then(callback).catch((error) => {
						errorHandler(error.toString());
					});
				});
			});
		}

		let decryptData = (encryptedObject, password, errorHandler, callback) => {
			
			getDerivation(password, errorHandler, (derivation) => {
				getKeyData(derivation, errorHandler, (keyData) => {
					
					let textDecoder = new TextDecoder('utf-8');
					
					crypto.subtle.decrypt({
						name : 'AES-CBC',
						iv : keyData.iv
					}, keyData.key, encryptedObject).then((decryptedText) => {
						
						callback(textDecoder.decode(decryptedText));
						
					}).catch((error) => {
						errorHandler(error.toString());
					});
				});
			});
		}
		
		let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
		let lookup = new Uint8Array(256);
		for (let i = 0; i < chars.length; i += 1) {
			lookup[chars.charCodeAt(i)] = i;
		}
		
		let arrayBufferToBase64 = (arrayBuffer) => {
			
			let bytes = new Uint8Array(arrayBuffer);
			let length = bytes.length;
			let base64 = '';
			
			for (let i = 0; i < length; i += 3) {
				base64 += chars[bytes[i] >> 2];
				base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
				base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
				base64 += chars[bytes[i + 2] & 63];
			}
			
			if ((length % 3) === 2) {
				base64 = base64.substring(0, base64.length - 1) + '=';
			} else if (length % 3 === 1) {
				base64 = base64.substring(0, base64.length - 2) + '==';
			}
			
			return base64;
		};
		
		let base64ToArrayBuffer = (base64) => {
			
			let bufferLength = base64.length * 0.75;
			let length = base64.length;
			
			if (base64[base64.length - 1] === '=') {
				bufferLength -= 1;
				if (base64[base64.length - 2] === '=') {
					bufferLength -= 1;
				}
			}
			
			let arrayBuffer = new ArrayBuffer(bufferLength);
			let bytes = new Uint8Array(arrayBuffer);
			
			let p = 0;
			let a, b, c, d;
			
			for (let i = 0; i < length; i += 4) {
				
				a = lookup[base64.charCodeAt(i)];
				b = lookup[base64.charCodeAt(i + 1)];
				c = lookup[base64.charCodeAt(i + 2)];
				d = lookup[base64.charCodeAt(i + 3)];
				
				bytes[p] = (a << 2) | (b >> 4);
				bytes[p + 1] = ((b & 15) << 4) | (c >> 2);
				bytes[p + 2] = ((c & 3) << 6) | (d & 63);
				p += 3;
			}
			
			return arrayBuffer;
		};

		let encrypt = self.encrypt = (params, callbackOrHandlers) => {
			//REQUIRED: params
			//REQUIRED: params.text
			//REQUIRED: params.password
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success

			let text = params.text;
			let password = params.password;
			
			let errorHandler;
			let callback;
			
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				errorHandler = callbackOrHandlers.error;
				callback = callbackOrHandlers.success;
			}
			
			encryptData(text, password, (errorMsg) => {
				if (errorHandler !== undefined) {
					errorHandler(errorMsg);
				} else {
					SHOW_ERROR('DPlayInventory.Crypto', errorMsg);
				}
			}, (encryptedObject) => {
				callback(arrayBufferToBase64(encryptedObject));
			});
		};

		let decrypt = self.decrypt = (params, callbackOrHandlers) => {
			//REQUIRED: params
			//REQUIRED: params.encryptedText
			//REQUIRED: params.password
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success

			let encryptedText = params.encryptedText;
			let password = params.password;
			
			let errorHandler;
			let callback;
			
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				errorHandler = callbackOrHandlers.error;
				callback = callbackOrHandlers.success;
			}

			decryptData(base64ToArrayBuffer(encryptedText), password, (errorMsg) => {
				if (errorHandler !== undefined) {
					errorHandler(errorMsg);
				} else {
					SHOW_ERROR('DPlayInventory.Crypto', errorMsg);
				}
			}, (text) => {
				callback(text);
			});
		};
	}
});