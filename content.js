var selectedText;

main();

function main() {
	chrome.runtime.onMessage.addListener(recievedMessage);
}

// function attaches an event listner for user to click a headline, then removes itself
function headlineEventListener() {
	document.addEventListener('click', function _listener(e) {
    	e = e || window.event;
    	var target = e.target || e.srcElement;
        
        selectedText = target.textContent || target.innerText;
      
        getNews(selectedText);

        document.removeEventListener('click', _listener, true);
	}, true);
}

function recievedMessage(message, sender, response){
	if (message.txt === "true"){
		headlineEventListener();
	}
}

function getNews(queryParameter){
	var link = "https://newsapi.org/v2/everything?q=";
	queryParameter = encodeURI(queryParameter);
	link = link + queryParameter;
	
	// setup request
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (xhr.status >= 200 && xhr.status < 300) {
			// xhr returned successfully
			console.log(JSON.parse(xhr.response)["articles"]); // for testing
		}
	};

	// send request
	xhr.open('GET', link);
	xhr.send();
}