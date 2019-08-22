DPlayInventory.Layout = CLASS((cls) => {
	
	let contentWrapper;
	
	let setContent = cls.setContent = (content) => {
		contentWrapper.empty();
		contentWrapper.append(content);
	};
	
	return {
		
		preset : () => {
			return VIEW;
		},
		
		init : (inner, self) => {
			
			let tabWrapper;
			let gameTab;
			let itemTab;
			let moneyTab;
			let signRecordTab;
			
			let wrapper = DIV({
				style : {
					position : 'relative',
					margin : 'auto',
					width : 415,
					height : 550,
					backgroundColor : '#000'
				},
				c : [
				
				// 상단 바
				DIV({
					style : {
						padding : 0
					},
					c : [
					
					// 로고
					A({
						style : {
							flt : 'left',
							padding : 10,
							color : '#707474'
						},
						c : [SPAN({
							style : {
								color : '#980100',
								fontWeight : 'bold',
							},
							c : 'DPlay'
						}), ' 보관함'],
						on : {
							tap : () => {
								DPlayInventory.GO('');
							}
						}
					}),
					
					// 메뉴 버튼
					A({
						style : {
							padding : 12,
							paddingBottom : 10,
							flt : 'right',
							color : '#980100'
						},
						c : FontAwesome.GetIcon('bars'),
						on : {
							tap : () => {
								openMenu();
							}
						}
					}),
					
					CLEAR_BOTH()]
				}),
				
				// 탭
				tabWrapper = DIV({
					c : [gameTab = A({
						style : {
							flt : 'left',
							width : 100,
							padding : '5px 0',
							textAlign : 'center',
							backgroundColor : '#151515',
							borderRadius : '5px 5px 0 0'
						},
						c : '게임',
						on : {
							tap : () => {
								DPlayInventory.GO('game');
							}
						}
					}), itemTab = A({
						style : {
							marginLeft : 5,
							flt : 'left',
							width : 100,
							padding : '5px 0',
							textAlign : 'center',
							backgroundColor : '#151515',
							borderRadius : '5px 5px 0 0'
						},
						c : '아이템',
						on : {
							tap : () => {
								DPlayInventory.GO('item');
							}
						}
					}), moneyTab = A({
						style : {
							marginLeft : 5,
							flt : 'left',
							width : 100,
							padding : '5px 0',
							textAlign : 'center',
							backgroundColor : '#151515',
							borderRadius : '5px 5px 0 0'
						},
						c : '재화',
						on : {
							tap : () => {
								DPlayInventory.GO('money');
							}
						}
					}), signRecordTab = A({
						style : {
							marginLeft : 5,
							flt : 'left',
							width : 100,
							padding : '5px 0',
							textAlign : 'center',
							backgroundColor : '#151515',
							borderRadius : '5px 5px 0 0'
						},
						c : '서명 이력',
						on : {
							tap : () => {
								DPlayInventory.GO('signrecord');
							}
						}
					}), CLEAR_BOTH()]
				}),
				
				// 내용
				contentWrapper = DIV({
					style : {
						backgroundColor : '#1e1e1e',
						height : 483
					}
				}),
				
				CONFIG.isDevMode === true ? DIV({
					style : {
						position : 'fixed',
						left : 10,
						top : 10
					},
					c : [H3({
						c : '테스트 메뉴'
					}), DIV({
						c : [
						A({
							c : '스마트 계약 배포하기',
							on : {
								tap : () => {
									
									DPlayInventory.Ethereum.deploySmartContract({
										abi : [{"constant":true,"inputs":[{"name":"interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setDPlayTradingPostOnce","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"DECIMALS","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getPower","outputs":[{"name":"power","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"network","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"TOTAL_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"NAME","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"author","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"createDCForTest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setDPlayStoreOnce","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"dplayStore","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dplayTradingPost","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"SYMBOL","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}],
										bytecode : '0x60806040523480156200001157600080fd5b50600115156200003b73a6e90a28f446d3639916959b6087f68d9b83fca9620007ff60201b60201c565b15151415620001d157600073a6e90a28f446d3639916959b6087f68d9b83fca973ffffffffffffffffffffffffffffffffffffffff166040516024016040516020818303038152906040527fb1bcbca4000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040518082805190602001908083835b6020831062000129578051825260208201915060208101905060208303925062000104565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d80600081146200018d576040519150601f19603f3d011682016040523d82523d6000602084013e62000192565b606091505b50509050600115158115151415620001cf5760008060006101000a81548160ff02191690836004811115620001c357fe5b02179055505062000733565b505b60011515620001fa739a6dc2a58256239500d96fb6f13d73b70c3d88f9620007ff60201b60201c565b1515141562000390576000739a6dc2a58256239500d96fb6f13d73b70c3d88f973ffffffffffffffffffffffffffffffffffffffff166040516024016040516020818303038152906040527f49aa4ea5000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040518082805190602001908083835b60208310620002e85780518252602082019150602081019050602083039250620002c3565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d80600081146200034c576040519150601f19603f3d011682016040523d82523d6000602084013e62000351565b606091505b505090506001151581151514156200038e5760016000806101000a81548160ff021916908360048111156200038257fe5b02179055505062000733565b505b60011515620003b973212cc55dd760ec5352185a922c61ac41c8ddb197620007ff60201b60201c565b151514156200054f57600073212cc55dd760ec5352185a922c61ac41c8ddb19773ffffffffffffffffffffffffffffffffffffffff166040516024016040516020818303038152906040527f8c74307d000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040518082805190602001908083835b60208310620004a7578051825260208201915060208101905060208303925062000482565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d80600081146200050b576040519150601f19603f3d011682016040523d82523d6000602084013e62000510565b606091505b505090506001151581151514156200054d5760026000806101000a81548160ff021916908360048111156200054157fe5b02179055505062000733565b505b60011515620005787354d1991a37cba30e5371f83e8c2b1f762c7096c2620007ff60201b60201c565b151514156200070e5760007354d1991a37cba30e5371f83e8c2b1f762c7096c273ffffffffffffffffffffffffffffffffffffffff166040516024016040516020818303038152906040527fa17b701a000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040518082805190602001908083835b6020831062000666578051825260208201915060208101905060208303925062000641565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114620006ca576040519150601f19603f3d011682016040523d82523d6000602084013e620006cf565b606091505b505090506001151581151514156200070c5760036000806101000a81548160ff021916908360048111156200070057fe5b02179055505062000733565b505b60046000806101000a81548160ff021916908360048111156200072d57fe5b02179055505b601260ff16600a0a6402540be40002600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef601260ff16600a0a6402540be400026040518082815260200191505060405180910390a362000818565b600080823b905060008163ffffffff1611915050919050565b6114de80620008286000396000f3fe6080604052600436106100fe5760003560e01c80636739afca11610095578063c11746b511610064578063c11746b514610597578063cdd7b715146105d2578063d659d11d14610623578063dd62ed3e1461067a578063e8672bc9146106ff576100fe565b80636739afca1461040357806370a082311461043c57806395d89b41146104a1578063a9059cbb14610531576100fe565b806323b872dd116100d157806323b872dd146102965780632901669f1461031c578063313ce5671461036d5780635dd9147c1461039e576100fe565b806301ffc9a71461010357806306fdde0314610175578063095ea7b31461020557806318160ddd1461026b575b600080fd5b34801561010f57600080fd5b5061015b6004803603602081101561012657600080fd5b8101908080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19169060200190929190505050610756565b604051808215151515815260200191505060405180910390f35b34801561018157600080fd5b5061018a610807565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101ca5780820151818401526020810190506101af565b50505050905090810190601f1680156101f75780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6102516004803603604081101561021b57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610844565b604051808215151515815260200191505060405180910390f35b34801561027757600080fd5b50610280610936565b6040518082815260200191505060405180910390f35b610302600480360360608110156102ac57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061094c565b604051808215151515815260200191505060405180910390f35b34801561032857600080fd5b5061036b6004803603602081101561033f57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610d96565b005b34801561037957600080fd5b50610382610e35565b604051808260ff1660ff16815260200191505060405180910390f35b3480156103aa57600080fd5b506103ed600480360360208110156103c157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610e3e565b6040518082815260200191505060405180910390f35b34801561040f57600080fd5b50610418610e87565b6040518082600481111561042857fe5b60ff16815260200191505060405180910390f35b34801561044857600080fd5b5061048b6004803603602081101561045f57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610e99565b6040518082815260200191505060405180910390f35b3480156104ad57600080fd5b506104b6610ee2565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104f65780820151818401526020810190506104db565b50505050905090810190601f1680156105235780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61057d6004803603604081101561054757600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610f1f565b604051808215151515815260200191505060405180910390f35b3480156105a357600080fd5b506105d0600480360360208110156105ba57600080fd5b8101908080359060200190929190505050611120565b005b3480156105de57600080fd5b50610621600480360360208110156105f557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506111a2565b005b34801561062f57600080fd5b50610638611241565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561068657600080fd5b506106e96004803603604081101561069d57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611267565b6040518082815260200191505060405180910390f35b34801561070b57600080fd5b506107146113e4565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60006301ffc9a760e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806107d0575063942e8b2260e01b827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b8061080057506336372b0760e01b827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b9050919050565b60606040518060400160405280600a81526020017f44506c617920436f696e00000000000000000000000000000000000000000000815250905090565b600081600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b6000601260ff16600a0a6402540be40002905090565b60006001151561095b8461140a565b1515141561096857600080fd5b600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548211156109b457600080fd5b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610a5d5750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b80610ae45750600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548211155b610aed57600080fd5b610b3f82600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461147890919063ffffffff16565b600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610bd482600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461148f90919063ffffffff16565b600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610ca682600260008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461147890919063ffffffff16565b600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190509392505050565b600073ffffffffffffffffffffffffffffffffffffffff16600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610df157600080fd5b80600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60006012905090565b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000809054906101000a900460ff1681565b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606040518060400160405280600281526020017f4443000000000000000000000000000000000000000000000000000000000000815250905090565b600060011515610f2e8461140a565b15151415610f3b57600080fd5b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054821115610f8757600080fd5b610fd982600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461147890919063ffffffff16565b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061106e82600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461148f90919063ffffffff16565b600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b6000600481111561112d57fe5b6000809054906101000a900460ff16600481111561114757fe5b141561115257600080fd5b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555050565b600073ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146111fd57600080fd5b80600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614806113125750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b1561135e57600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506113de565b600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b92915050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16148061147157503073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b9050919050565b60008282111561148457fe5b818303905092915050565b60008183019050828110156114a057fe5b8090509291505056fea265627a7a7230582032bfbcc9283bb58ae937501053eb613fc4462f00e482cf61751d1a0471b881ca64736f6c63430005090032'
									});
								}
							}
						})]
					})]
				}) : undefined]
			}).appendTo(BODY);
			
			let openMenu = self.openMenu = () => {
				
				let menu = UL({
					style : {
						position : 'absolute',
						right : 0,
						top : 38
					}
				}).appendTo(wrapper);
				
				EACH([{
					title : '내 계정',
					uri : 'account'
				}, {
					title : '네트워크 변경',
					uri : 'changenetwork'
				}], (menuInfo, index) => {
					
					menu.append(LI({
						style : {
							border : '1px solid #666',
							backgroundColor : '#333',
							marginTop : -1
						},
						c : A({
							style : {
								width : 150,
								display : 'block',
								padding : 10,
								textAlign : 'center'
							},
							c : menuInfo.title,
							on : {
								touchstart : () => {
									DPlayInventory.GO(menuInfo.uri);
								}
							}
						})
					}));
				});
				
				EVENT_ONCE('touchstart', () => {
					menu.remove();
				});
			};
			
			let hideTabs = () => {
				tabWrapper.hide();
				contentWrapper.addStyle({
					height : 512
				});
			}
			
			let showTabs = () => {
				tabWrapper.show();
				contentWrapper.addStyle({
					height : 483
				});
			}
			
			let onTab = (tab) => {
				tab.addStyle({
					backgroundColor : '#1e1e1e'
				});
			}
			
			let offTab = (tab) => {
				tab.addStyle({
					backgroundColor : '#151515'
				});
			}
			
			inner.on('uriChange', (uri) => {
				
				if (uri === 'game') {
					showTabs();
					onTab(gameTab);
					offTab(itemTab);
					offTab(moneyTab);
					offTab(signRecordTab);
				}
				
				else if (uri === 'item') {
					showTabs();
					offTab(gameTab);
					onTab(itemTab);
					offTab(moneyTab);
					offTab(signRecordTab);
				}
				
				else if (uri === 'money') {
					showTabs();
					offTab(gameTab);
					offTab(itemTab);
					onTab(moneyTab);
					offTab(signRecordTab);
				}
				
				else if (uri === 'signrecord') {
					showTabs();
					offTab(gameTab);
					offTab(itemTab);
					offTab(moneyTab);
					onTab(signRecordTab);
				}
				
				else {
					hideTabs();
				}
			});
			
			inner.on('close', () => {
				
				wrapper.remove();
				
				contentWrapper = undefined;
			});
		}
	};
});