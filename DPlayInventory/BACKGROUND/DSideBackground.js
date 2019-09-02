global.DSideBackground = OBJECT({

	preset : () => {
		return WebExtensionBackground;
	},
	
	params : () => {
		return {
			backgroundName : 'DSideBackground'
		};
	},

	init : (inner, self) => {
		
		const HARD_CODED_URLS = ['localhost:8814'];
		
		let networkName = 'Unknown';
		
		let setNetworkName = self.setNetworkName = (_networkName) => {
			//REQUIRED: networkName
			
			networkName = _networkName;
		};
		
		let nodeURLs;
		
		let innerSendToNode;
		let innerOnFromNode;
		let innerOffFromNode;
		let timeDiffWithNode = 0;
		
		let waitingSendInfos = [];
		let onInfos = [];
		
		let sendToNode = (methodName, data, callback) => {
			
			if (innerSendToNode === undefined) {
				
				waitingSendInfos.push({
					params : {
						methodName : methodName,
						data : data
					},
					callback : callback
				});
				
			} else {
				
				innerSendToNode({
					methodName : methodName,
					data : data
				}, callback);
			}
		};
		
		let onFromNode = (methodName, method) => {
			
			onInfos.push({
				methodName : methodName,
				method : method
			});
	
			if (innerOnFromNode !== undefined) {
				innerOnFromNode(methodName, method);
			}
		};
		
		let offFromNode = (methodName, method) => {
			
			if (innerOffFromNode !== undefined) {
				innerOffFromNode(methodName, method);
			}
			
			if (method !== undefined) {
				
				REMOVE(onInfos, (onInfo) => {
					return onInfo.methodName === methodName && onInfo.method === method;
				});
				
			} else {
				
				REMOVE(onInfos, (onInfo) => {
					return onInfo.methodName === methodName;
				});
			}
		};
		
		let connectToFastestNode = () => {
			
			let isFoundFastestNode;
			
			// 모든 노드들에 연결합니다.
			EACH(nodeURLs, (url) => {
				
				let splits = url.split(':');
				
				CONNECT_TO_WEB_SOCKET_SERVER({
					host : splits[0],
					port : INTEGER(splits[1])
				}, {
					error : () => {
						// 연결 오류를 무시합니다.
					},
					success : (on, off, send, disconnect) => {
						
						if (isFoundFastestNode !== true) {
							
							send('getNodeTime', (nodeTime) => {
								
								// 가장 빠른 노드를 찾았습니다.
								if (isFoundFastestNode !== true) {
									
									innerSendToNode = send;
									innerOnFromNode = on;
									innerOffFromNode = off;
									timeDiffWithNode = Date.now() - nodeTime;
									
									// 가장 빠른 노드를 찾고 난 뒤 대기중인 내용 실행
									EACH(onInfos, (onInfo) => {
										innerOnFromNode(onInfo.methodName, onInfo.method);
									});
									
									EACH(waitingSendInfos, (sendInfo) => {
										innerSendToNode(sendInfo.params, sendInfo.callback);
									});
									
									// 노드와의 접속이 끊어지면, 모든 내용을 초기화하고 다시 가장 빠른 노드를 찾습니다.
									on('__DISCONNECTED', () => {
										
										innerSendToNode = undefined;
										innerOnFromNode = undefined;
										innerOffFromNode = undefined;
										timeDiffWithNode = 0;
										
										waitingSendInfos = [];
										onInfos = [];
										
										connectToFastestNode();
									});
									
									isFoundFastestNode = true;
								}
								
								else {
									disconnect();
								}
							});
						}
						
						else {
							disconnect();
						}
					}
				});
			});
		};
		
		let isSomeNodeConnected = false;
		
		// 하드코딩된 노드들의 URL로부터 최초 접속 노드를 찾습니다.
		EACH(HARD_CODED_URLS, (url) => {
			
			let splits = url.split(':');
			
			CONNECT_TO_WEB_SOCKET_SERVER({
				host : splits[0],
				port : INTEGER(splits[1])
			}, {
				error : () => {
					// 연결 오류를 무시합니다.
				},
				success : (on, off, send, disconnect) => {
					
					if (isSomeNodeConnected !== true) {
						
						// 실제로 연결된 노드 URL 목록을 가져옵니다.
						send('getNodeURLs', (urls) => {
							
							if (isSomeNodeConnected !== true) {
								
								nodeURLs = urls;
								
								connectToFastestNode();
								
								isSomeNodeConnected = true;
							}
							
							disconnect();
						});
					}
					
					else {
						disconnect();
					}
				}
			});
		});
	}
});