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

        getNews(removeStopWords(selectedText).split('+').slice(0,3).join('+'));

        document.removeEventListener('click', _listener, true);
	}, true);
}

function recievedMessage(message, sender, response){
	if (message.txt === "textSelected"){
		headlineEventListener();
	}
}

function getNews(queryParameter){
	var link = "https://newsapi.org/v2/everything?q=";
	queryParameter = encodeURI(queryParameter);
	link = link + queryParameter + "&apiKey=" + apiKey; // build API query

	// setup request
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (xhr.status >= 200 && xhr.status < 300) {
			// xhr returned successfully
			appendNewArticles(JSON.parse(xhr.response)["articles"]);
		}
	};

	// send request
	xhr.open('GET', link);
	xhr.send();
}

function appendNewArticles(articles){
	var contentDiv = document.createElement("div");
	var pTag = document.createElement("p");
	var hrTag = document.createElement("hr");
	var hrTag2 = document.createElement("hr");

	pTag.textContent = "Articles found by NewsSip, refresh to remove";
	pTag.setAttribute('style', 'text-align: left; padding-left: 2rem');

	contentDiv.setAttribute("style", "text-align: center; padding-top: 2rem; padding-bottom: 1rem");
	contentDiv.appendChild(pTag);
	contentDiv.appendChild(hrTag);

	articles.slice(-5).forEach(function(article) {
		contentDiv.appendChild(buildArticleObject(article));
	});

	contentDiv.appendChild(hrTag2);
	document.body.insertBefore(contentDiv, document.body.firstChild);
}

function buildArticleObject(article){
	var divTag = document.createElement("div");
	var aTag = document.createElement("a");
	var pTag = document.createElement("p");
	var articleDate = new Date(article.publishedAt).toISOString();

	aTag.textContent = article["title"];
	aTag.href = article["url"];
	aTag.setAttribute('target', '_blank');
	aTag.setAttribute('style', 'padding: 0 1rem');

	articleDate = articleDate.substring(0, articleDate.indexOf('T'));
	pTag.textContent = article.source.name + " - " + articleDate;

	if (article["urlToImage"]){
		var imgDivTag = document.createElement("div");
		imgDivTag.setAttribute('style', 'float: right;');

		var imgTag = document.createElement("img");
		imgTag.setAttribute('src', article["urlToImage"]);
		imgTag.setAttribute('style', 'width: 150px; height: 100px; border-radius: 5%');

		imgDivTag.appendChild(imgTag);
		divTag.appendChild(imgDivTag);
	}

	divTag.setAttribute('style', 'height: 125px; margin: 0 5rem');
	divTag.setAttribute('title', article["description"]);
	divTag.appendChild(aTag);
	divTag.appendChild(pTag);

	return divTag;
}


function removeStopWords(phrase){
	var stopWords = ["look", "back", "a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've", "read", "more"];
	var editedPhrase = phrase;
	var finalPhrase = "";

	editedPhrase = editedPhrase.replace(/[.,\/#!$%\^'"&\*;:{}=\-_`~()]/g,""); // remove punctuation
	editedPhrase = editedPhrase.replace(/\s{2,}/g," "); // remove spaces left by punctuation 

	editedPhrase.split(" ").forEach(function(word){
		word = word.trim().toLowerCase();
		if (!stopWords.includes(word)) {
        	finalPhrase += word + "+";
        }
	});

	finalPhrase = finalPhrase.replace(/\+\s*$/, ""); // remove trailing +
	return finalPhrase;
}