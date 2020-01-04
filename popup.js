var selectedText;

main();

function main() {
	document.getElementById("selectPageBtn").addEventListener('click', function(e){
		toggleButtonVisibility();

		var msg = {
			txt: "true"
		};

		let params = {
			active: true,
			currentWindow: true
		};

		chrome.tabs.query(params, gotTabs);

		function gotTabs(tabs){
			chrome.tabs.sendMessage(tabs[0].id, msg);
		}
	});

	document.getElementById("cancelBtn").addEventListener('click', function(e){
		toggleButtonVisibility();
	});
}

function toggleButtonVisibility() {
	if (document.getElementById("selectPageBtn").style["display"] != "none"){
		document.getElementById("selectPageBtn").style["display"] = "none";
		document.getElementById("cancelBtn").style["display"] = "inline-block";
	} else {
		document.getElementById("selectPageBtn").style["display"] = "inline-block";
		document.getElementById("cancelBtn").style["display"] = "none";
	}
	
}

