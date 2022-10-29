fetch("https://api.tipeeestream.com/v2.0/site/socket")
	.then((res) => res.json())
	.then((json) => {
		if (json.code == 200) {
			const socket = io(`${json.datas.host}:${json.datas.port}`, {
				query: {
					access_token: CONFIG.apiKey,
				},
			});

			socket.on("connect", () => {
				console.log("Connected");
				socket.emit("join-room", {
					room: CONFIG.apiKey,
					username: "DerTyp876",
				});
			});
			socket.on("new-event", (data) => {
				if (data.event.type == "subscription") {
					sub(data.event.parameters.username);
				}
			});
		}
	});
