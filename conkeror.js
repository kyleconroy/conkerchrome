// Number of pixels to scroll up and down
var LINE = 40;

// Number of pixels to scroll left and right
var COLUMN = 20;

// Lots of pixels jump to the top or bottom of a page
var BIG = 10000000000;

// Modifier Keys
var META = "meta";
var CTRL = "ctrl";
var ALT = "alt";
var SHIFT = "shift";

// Return a ctrl keyboard shortcut
var ctrl = function(a) {
    return CTRL + "+" + a; 
}

// Return a meta keyboard shortcut
var meta = function(a) {
    return META + "+" + a; 
}

// Return a shift keyboard shortcut
var shift = function(a) {
    return SHIFT + "+" + a; 
}

// Module to hold all the keybindings
// I wrote this a while ago, not sure how it works
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
	    matched = true;
	    current = "";
	    fullKeyMap[combo]();
	}
    };

    var keyFn = function(kk){
	return function() {
	    combo = current + kk;
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

hotkeys.setUnrecognized(function(){});

// HTML Selectors for ConkerChrome elements
var selectors = {
    "conker": "#conkerchrome",
    "commandbar": "#commandbar",
    "commandinput": "#conkerchrome input",
    "number": ".conkerchrome_number"
}

// CSS Selectors for ConkerChrome elements
var css = {
    "highlight": "conkerchrome_highlight",
    "selected": "conkerchrome_selected",
    "number": "conkerchrome_number"
}

var baseMode = {
    "enter": function(){},
    "leave": function(){},
    "update": function(e, bar){}
}

// Current command
var currentMode  = baseMode;

// Create conkerbar
var conkerChrome = function(){

    jQuery(document.body).append("<div id=\"conkerchrome\"><div id=\"commandbar\"></div><input type=\"text\"></div>");
    var bar = jQuery(selectors.conker);
    var title = jQuery(selectors.commandbar);
    var input = jQuery(selectors.commandinput);

    jQuery('#conkerchrome input').keyup(function(e) {
	var bar = jQuery(e.target);
	if(e.keyCode == 71 && e.ctrlKey){
	    bar.blur();
	    cancel();
	}
	currentMode.update(e, bar);
    });

    return {
	"hide": function(){ bar.hide(); input.val("");},
	"show": function(text){ 
	    title.text(text);
	    bar.show();
	    input.css({"left": title.width() + 10}).focus();
	}
    };
}();


function showConkerChrome(){
    jQuery(selectors.conker).show();
}

function hideConkerChrome(){
    jQuery(selectors.conker).hide();
}

// Keyboard shortcuts
var cancel = function(){ 
    conkerChrome.hide();
    currentMode.leave();
    currentMode = baseMode;
};

// Unfocus selected area (such as a textbox)
hotkeys.add("esc", function(){ 
    $(":focus").blur();
});

// Cancel current command
hotkeys.add(ctrl('g'), cancel);

// Move back one page in the history
hotkeys.add(shift('b'), function() { 
    window.history.back();
});

// Move forward one page in the history
hotkeys.add(shift('f'), function() { 
    window.history.forward();
});

// Reload the current page
hotkeys.add(ctrl('r'), function() { 
    window.location.reload(true);
});

// Movement around the page

// Scroll the page all the way to the right
hotkeys.add(ctrl('a'), function(){
    window.scrollBy(-BIG, 0);
});

// Scroll the page all the way to the left
hotkeys.add(ctrl('e'), function(){
    window.scrollBy(BIG, 0);
});

// Scroll the page forward a column
hotkeys.add(ctrl('f'), function(){
    window.scrollBy(COLUMN, 0);
});

// Scroll the page back a column
hotkeys.add(ctrl('b'), function(){
    window.scrollBy(-COLUMN, 0);
});

// Scroll the page down a line
hotkeys.add(ctrl('n'), function(){
    window.scrollBy(0, LINE);
});

// Scroll the page up a line
hotkeys.add(ctrl('p'), function(){
    window.scrollBy(0, -LINE);
});

// Jump down a page length
hotkeys.add(ctrl('v'), function(){
    window.scrollBy(0, window.innerHeight - LINE);
});

// Jump up a page length
hotkeys.add(meta('v'), function(){
    window.scrollBy(0, -(window.innerHeight - LINE));
});


// Jump to the end of the page
hotkeys.add(meta(shift('.')), function(){
    window.scrollBy(0, BIG);
});

// Jump to the top of the page
hotkeys.add(meta(shift(',')), function(){
    window.scrollBy(0, -BIG);
});

// Open a url
// TODO: Make this work
hotkeys.add('ctrl+x ctrl+f', function() { 
    conkerChrome.show();
});

// Close the current tab
hotkeys.add('ctrl+x k', function() {
    chrome.extension.sendRequest({action: "close-tab"});
});

hotkeys.add('f', function (evt){ 
    followMode.enter();
    currentMode = followMode;
});

// Follow a link on the page
// TODO: Make this work
var followMode = {
    enter: function(){
	jQuery("a").each(function(i, elem){
	    jQuery(this).append(jQuery("<div/>", {"class": css.number, "text": i}))
		.addClass(css.highlight);
	});
	conkerChrome.show("Enter Link ID");
    },
    update: function(e, bar) {
	// Get the selected link or return
	var v = bar.val();
	if (!v) return;
	link = jQuery("a:eq(" + v + ")");
	// If the return was pressed,
	if (e.keyCode == 13) {
	    if (link && link.attr("href")) {
		// If shift+return, open new tab
		if (e.shiftKey) {
		    chrome.extension.sendRequest({
			action: "new-tab",
			url: link.attr("href")
		    });
	    	} else {
		    window.location.href = link.attr("href");
		}
	    }
	} else {
	    jQuery("a." + css.selected).removeClass(css.selected);
	    if (link.hasClass(css.selected))
		return;
	    link.addClass(css.selected);
	}
    },
    leave: function(){
	jQuery("a").removeClass(css.highlight)
	    .removeClass(css.selected);
	jQuery(selectors.number).remove();
    }
}
