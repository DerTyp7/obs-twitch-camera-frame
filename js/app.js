const subCount = document.getElementById("subCount");
const frame = document.getElementById("frame");
const tfBanner = document.getElementById("teafire-banner");

let subCountNumber = 0;

function updateSubCount() {
	fetch(
		`https://api.tipeeestream.com/v1.0/events/forever.json?apiKey=${CONFIG.apiKey}`
	)
		.then((res) => res.json())
		.then((json) => {
			subCountNumber = json.datas.subscribers;
			subCount.innerText = subCountNumber;
		});
}

function sub(subName) {
	frame.style.animationName = "subAnimation";
	frame.style.animationDuration = "2s";

	subCount.style.animationName = "backgroundSubAnimation";
	subCount.style.animationDuration = "2s";

	subCount.innerText = subName + " " + subCountNumber;

	setTimeout(() => {
		frame.style.animationName = "borderAnimation";
		frame.style.animationDuration = "20s";

		subCount.style.animationName = "backgroundAnimation";
		subCount.style.animationDuration = "20s";
		subCount.innerText = subCountNumber;
		updateSubCount();
	}, 11000);
}

function showTealFireBanner() {
	tfBanner.style.animationName = "tfBannerAnimation";
	tfBanner.style.animationDuration = "3s";
	tfBanner.style.animationDirection = "normal";
	setTimeout(() => {
		tfBanner.style.marginTop = "0px";
		tfBanner.style.animationName = "";
		tfBanner.style.animationDuration = "";
	}, 3000);
}

function closeTealFireBanner() {
	tfBanner.style.animationName = "tfBannerAnimation";
	tfBanner.style.animationDuration = "3s";
	tfBanner.style.animationDirection = "reverse";

	setTimeout(() => {
		tfBanner.style.marginTop = "-200px";
		tfBanner.style.animationName = "";
		tfBanner.style.animationDuration = "";
	}, 3000);
}

setInterval(() => {
	showTealFireBanner();
	setTimeout(() => {
		closeTealFireBanner();
	}, 20000);
}, 300000);
updateSubCount();
