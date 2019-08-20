chrome.storage.sync.get(['foo', 'bar'], (r) => {
	console.log(r);
});