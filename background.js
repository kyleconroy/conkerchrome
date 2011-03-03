chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
	console.log(request.action);
	if (request.action == "next-tab") {
	    chrome.tabs.getSelected(null, function(tab){
		chrome.tabs.getAllInWindow(null, function(tabs) {
		    if (tab.index + 1 === tabs.length)
			var t = tabs[0];
		    else
			var t = tabs[tab.index+1];
		    chrome.tabs.update(t.id, {selected: true});
		});
	    });
	    sendResponse({});

	} else if (request.action == "close-tab") {
	    chrome.tabs.getSelected(null, function(tab){
		chrome.tabs.remove(tab.id);
	    });
	    sendResponse({});
	} else if (request.action == "previous-tab") {
	    chrome.tabs.getSelected(null, function(tab){
		chrome.tabs.getAllInWindow(null, function(tabs) {
		    if (tab.index === 0)
			var t = tabs[tabs.length - 1];
		    else
			var t = tabs[tab.index - 1];
		    chrome.tabs.update(t.id, {selected: true});
		});
	    });
	    sendResponse({});
	
	} else {
	    sendResponse({}); // snub them.
	}
    }
);