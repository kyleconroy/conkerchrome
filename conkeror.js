// Hotkeys 
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

/** Forward a line **/
hotkeys.add('ctrl+n', function(){});

/** Back a line **/
hotkeys.add('ctrl+p', function(){});

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

