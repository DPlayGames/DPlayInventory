DPlayInventory.Money = CLASS({

	preset : () => {
		return VIEW;
	},

	init : (inner, self) => {
		
		let inventoryStore = DPlayInventory.STORE('inventoryStore');
		
		let dcPanel;
		let dPanel;
		let etherPanel;
		
		let content = DIV({
			c : [dcPanel = DIV({
				c : 'DC: ...', 
			}), A({
				c : '충전하기',
				target : '_blank',
				href : 'http://faucet.dplay.games'
			}), A({
				c : '보내기'
			}), dPanel = DIV({
				c : ['d: ...', A({
					c : '충전하기'
				}), A({
					c : '보내기'
				})]
			}), etherPanel = DIV({
				c : 'Ether: ...'
			}), A({
				c : '충전하기',
				target : '_blank',
				href : 'https://faucet.kovan.network'
			}), A({
				c : '보내기'
			})]
		});
		
		DPlayInventory.DPlayCoin.getBalance((balance) => {
			dcPanel.empty();
			dcPanel.append('DC: ' + DPlayInventory.DPlayCoin.getDisplayPrice(balance));
		});
		
		DPlayInventory.DSide.getDBalance((balance) => {
			dPanel.empty();
			dPanel.append('d: ' + balance);
		});
		
		DPlayInventory.Ethereum.getEtherBalance((balance) => {
			etherPanel.empty();
			etherPanel.append('Ether: ' + DPlayInventory.Ethereum.getDisplayPrice(balance));
		});
		
		DPlayInventory.Layout.setContent(content);
		
		inventoryStore.save({
			name : 'lastTab',
			value : 'money'
		});
		
		inner.on('close', () => {
			content.remove();
		});
	}
});