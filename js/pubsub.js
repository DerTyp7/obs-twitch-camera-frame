const rootElem = document.querySelector(":root");
let ws;
let channelId;

function changeColorTheme(theme) {
	localStorage.setItem("theme", JSON.stringify(theme));
	rootElem.style.setProperty("--border-color-1", theme[0]);
	rootElem.style.setProperty("--border-color-2", theme[1]);
}

function pubSubNonce(length) {
	var text = "";
	var possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function pubSubHeartbeat() {
	message = {
		type: "PING",
	};
	ws.send(JSON.stringify(message));
}

function pubSubListen(topic) {
	message = {
		type: "LISTEN",
		nonce: pubSubNonce(15),
		data: {
			topics: [topic],
			auth_token: CONFIG.twitch.oAuth,
		},
	};
	ws.send(JSON.stringify(message));
}

function pubSubConnect() {
	var heartbeatInterval = 1000 * 60; //ms between PING's
	var reconnectInterval = 1000 * 3; //ms to wait before reconnect
	var heartbeatHandle;

	ws = new WebSocket("wss://pubsub-edge.twitch.tv");

	ws.onopen = function (event) {
		console.log("PubSub Opened");
		pubSubHeartbeat();
		heartbeatHandle = setInterval(pubSubHeartbeat, heartbeatInterval);

		pubSubListen("channel-points-channel-v1." + channelId);
	};

	ws.onerror = function (error) {
		console.log("ERR:  " + JSON.stringify(error) + "\n");
	};

	ws.onmessage = function (event) {
		data = JSON.parse(event.data);
		if (data.type == "MESSAGE") {
			message = JSON.parse(data.data.message);
			reward = message.data.redemption.reward;
			console.log(`Received reward: ${reward.id} - ${reward.title}`);
			switch (reward.id) {
				case CONFIG.twitch.rewardIds.turnGreen:
					changeColorTheme(CONFIG.themes.green);
					break;
				case CONFIG.twitch.rewardIds.turnPurple:
					changeColorTheme(CONFIG.themes.purple);
					break;
				case CONFIG.twitch.rewardIds.turnRed:
					changeColorTheme(CONFIG.themes.red);
					break;
				case CONFIG.twitch.rewardIds.turnBlue:
					changeColorTheme(CONFIG.themes.blue);
					break;
			}
		}

		if (message.type == "RECONNECT") {
			setTimeout(pubSubConnect, reconnectInterval);
		}
	};

	ws.onclose = function () {
		clearInterval(heartbeatHandle);
		setTimeout(pubSubConnect, reconnectInterval);
	};
}

function pubSubMain() {
	fetch("https://api.twitch.tv/helix/users?login=" + CONFIG.twitch.username, {
		headers: {
			Authorization: "Bearer " + CONFIG.twitch.oAuth,
			"Client-Id": CONFIG.twitch.clientId,
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((resData) => {
			channelId = resData.data[0].id;
			pubSubConnect();
		});
}

pubSubMain();
changeColorTheme(JSON.parse(localStorage.getItem("theme")));
