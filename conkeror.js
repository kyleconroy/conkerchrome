// Hotkeys 
var LINE = 40;
var COLUMN = 20;
var BIG = 10000000000;

var hotkeys = function() {
    var matched = false;
    var current = "";
    var combo = "";
    var partialKeyMap = {};
    var fullKeyMap = {};
    var keyMap = {};
    var unrecognized = function(){};

    var keyPress = function() {
	if (partialKeyMap[combo]) {
	    current = combo;
	    matched = true;
	} else if (fullKeyMap[combo]) {
	    console.log("Pressed " + combo);
	    matched = true;
	    current = "";
	    fullKeyMap[combo]();
	}
    };

    var keyFn = function(kk){
	return function() {
	    combo = current + kk;
	    console.log(combo);
	    keyPress();
	}
    };

    $(document).keydown(function() {
	matched = false;
	command = false;
    });

    $(document).keyup(function() {
	if(!matched) {
	    unrecognized();
	    current = "";
	}
    });

    // Return the hotkeys object
    return {
	setUnrecognized: function(fn){ unrecognized = fn; },
	add: function(k, fn){

	    var keys = k.toLowerCase().split(" ");
	    var seq = "";

	    for ( var i = 0, l = keys.length; i < l; i++ ) {

		//Create a partial mapping
		seq += keys[i];
		if (i < (l - 1)) {
		    partialKeyMap[seq] = true;
		} else {
		    fullKeyMap[seq] = fn;
		}

		//Only maps keys we haven't seen before
		if (!keyMap[ keys[i] ]) {
		    keyMap[ keys[i] ] = true;
		    $(document).bind('keydown', keys[i], keyFn(keys[i]));
		}
	    }
	}
    }
}();

hotkeys.setUnrecognized(function(){ console.log("What??"); });

// HTML Selectors
var selectors = {
    "conker": "#conkerchrome",
    "number": ".conkerchrome_number"
}

var css = {
    "klass": {
	"highlight": "conkerchrome_highlight",
	"number": "conkerchrome_number"
    },
    "id": {}
}

var nullCommand = {
    "activate": function(){},
    "cancel": function(){}
}

// Current command
var currentCommand  = nullCommand;

// Create conkerbar
var conkerChrome = function(){

    jQuery(document.body).append("<div id=\"conkerchrome\"><div id=\"commandbar\"></div></div>");
    var bar = jQuery(selectors.conker);

    return {
	"hide": function(){ bar.hide();},
	"show": function(){ bar.show();}
    };
}();


function showConkerChrome(){
    jQuery(selectors.conker).show();
}

function hideConkerChrome(){
    jQuery(selectors.conker).hide();
}

/* Browsing */

/** Unfocus Area **/
hotkeys.add("esc", function(){ 
    $(":focus").blur();
});

/** Cancel **/
hotkeys.add("ctrl+g", function(){ 
    conkerChrome.hide();
    currentCommand.cancel();
    currentCommand = nullCommand;
});

/** Back **/
hotkeys.add('shift+b', function() { 
    window.history.back();
});

/** Back **/
hotkeys.add('shift+f', function() { 
    window.history.forward();
});

/** Reload **/
hotkeys.add('r', function() { 
    window.location.reload(true);
});

/** Find-url **/
hotkeys.add('g', function(){});

/* Movement */

/** Beginning of line **/
hotkeys.add('ctrl+a', function(){
    window.scrollBy(-BIG, 0);
});

/** End of a line **/
hotkeys.add('ctrl+e', function(){
    window.scrollBy(BIG, 0);
});

/** Forward a column **/
hotkeys.add('ctrl+f', function(){
    window.scrollBy(COLUMN, 0);
});

/** Back a column **/
hotkeys.add('ctrl+b', function(){
    window.scrollBy(-COLUMN, 0);
});

/** Forward a line **/
hotkeys.add('ctrl+n', function(){
    window.scrollBy(0, LINE);
});

/** Back a line **/
hotkeys.add('ctrl+p', function(){
    window.scrollBy(0, -LINE);
});

/** Page Down **/
hotkeys.add('ctrl+v', function(){
    window.scrollBy(0, window.innerHeight - LINE);
});

/** Page Up **/
hotkeys.add('alt+v', function(){
    window.scrollBy(0, -(window.innerHeight - LINE));
});


/** End of Document **/
hotkeys.add('alt+shift+.', function(){
    window.scrollBy(0, BIG);
});

/** Top of document **/
hotkeys.add('alt+shift+,', function(){
    window.scrollBy(0, -BIG);
});

/* Buffers */
/** Next buffer **/
hotkeys.add('alt+n', function(){
    chrome.extension.sendRequest({action: "next-tab"}, function(r){});
});

/** Previos buffer **/
hotkeys.add('alt+p', function(){
    chrome.extension.sendRequest({action: "previous-tab"}, function(r){});
});


/** Open a URL **/
hotkeys.add('ctrl+x ctrl+f', function() { 
    conkerChrome.show();
});

hotkeys.add('f', function (evt){ 
    highlightLinks.activate();
});

/* Follow */
var highlightLinks = {
    "activate": function(){
	conkerChrome.show();
	jQuery("a").each(function(i, elem){
	    jQuery(this).append(jQuery("<div/>", {"class": css.klass.number, "text": i}))
		.addClass(css.klass.highlight);
	});
    },
    "cancel": function(){
	jQuery("a").removeClass(css.klass.highlight);
	jQuery(selectors.number).remove();
    }
}

