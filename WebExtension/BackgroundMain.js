RUN(() => {
	
	const NETWORK_ADDRESSES = {
		Mainnet : 'ws://175.207.29.151:8546',
		Ropsten : 'wss://ropsten.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
		Rinkeby : 'wss://rinkeby.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
		Kovan : 'wss://kovan.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b',
		Goerli : 'wss://goerli.infura.io/ws/v3/c1a2b959458440c780e5614fd075051b'
	};
	
	global.web3 = new Web3(NETWORK_ADDRESSES.Kovan);
	
	INIT_OBJECTS();
});