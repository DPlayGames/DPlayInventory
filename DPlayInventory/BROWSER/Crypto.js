DPlayInventory.Crypto = OBJECT({

	init: (inner, self) => {

		const HASH = 'SHA-256';
		const SALT = 'Code is Law';
		const ITERATRIONS = 1000;
		const KEY_LENGTH = 48;

		async function getDerivation(hash, salt, password, iterations, keyLength) {
			const textEncoder = new TextEncoder('utf-8');
			const passwordBuffer = textEncoder.encode(password);
			const importedKey = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveBits']);
			const saltBuffer = textEncoder.encode(salt);
			const params = {
				name : 'PBKDF2',
				hash : hash,
				salt : saltBuffer,
				iterations : iterations
			};
			const derivation = await crypto.subtle.deriveBits(params, importedKey, keyLength * 8);
			return derivation;
		}

		async function getKey(derivation) {
			const ivlen = 16;
			const keylen = 32;
			const derivedKey = derivation.slice(0, keylen);
			const iv = derivation.slice(keylen);
			const importedEncryptionKey = await crypto.subtle.importKey('raw', derivedKey, {
				name : 'AES-CBC'
			}, false, ['encrypt', 'decrypt']);
			return {
				key : importedEncryptionKey,
				iv : iv
			};
		}

		async function encryptData(text, password) {
			const derivation = await getDerivation(HASH, SALT, password, ITERATRIONS, KEY_LENGTH);
			const keyObject = await getKey(derivation);
			const textEncoder = new TextEncoder('utf-8');
			const textBuffer = textEncoder.encode(text);
			return await crypto.subtle.encrypt({
				name : 'AES-CBC',
				iv : keyObject.iv
			}, keyObject.key, textBuffer);
		}

		async function decryptData(encryptedObject, password) {
			const derivation = await getDerivation(HASH, SALT, password, ITERATRIONS, KEY_LENGTH);
			const keyObject = await getKey(derivation);
			const textDecoder = new TextDecoder('utf-8');
			const decryptedText = await crypto.subtle.decrypt({
				name : 'AES-CBC',
				iv : keyObject.iv
			}, keyObject.key, encryptedObject);
			return textDecoder.decode(decryptedText);
		}

		let arrayBufferToString = (arrayBuffer) => {
			return String.fromCharCode.apply(null, new Uint16Array(arrayBuffer));
		};

		let stringToArrayBuffer = (str) => {
			let arrayBuffer = new ArrayBuffer(str.length * 2);
			let arrayBufferView = new Uint16Array(arrayBuffer);
			for (let i = 0; i < str.length; i += 1) {
				arrayBufferView[i] = str.charCodeAt(i);
			}
			return arrayBuffer;
		};

		let encrypt = self.encrypt = (params, callback) => {
			//REQUIRED: params
			//REQUIRED: params.text
			//REQUIRED: params.password
			//REQUIRED: callback

			let text = params.text;
			let password = params.password;
			
			encryptData(text, password).then((encryptedObject) => {
				callback(arrayBufferToString(encryptedObject));
			});
		};

		let decrypt = self.decrypt = (params, callback) => {
			//REQUIRED: params
			//REQUIRED: params.encryptedText
			//REQUIRED: params.password
			//REQUIRED: callback

			let encryptedText = params.encryptedText;
			let password = params.password;

			decryptData(stringToArrayBuffer(encryptedText), password).then((text) => {
				callback(text);
			});
		};
	}
});