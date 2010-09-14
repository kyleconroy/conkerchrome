//Multiple press handler
var modifiers = {
    "ctrlx": false
}

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

//Helpers
jQuery(document).bind('keyup', 'Ctrl', function (evt){ 
    modifiers["ctrlx"] = false;
});


/* Browsing */

/** Cancel **/
jQuery(document).bind('keydown', 'Ctrl+g', function (evt){ 
    console.log("C-g");
    conkerChrome.hide();
    currentCommand.cancel();
    currentCommand = nullCommand;
});

/** Back **/
jQuery(document).bind('keydown', 'Shift+B', function (evt){ 
    console.log("B");
    window.history.back();
});

/** Back **/
jQuery(document).bind('keydown', 'Shift+F', function (evt){ 
    console.log("F");
    window.history.forward();
});

/** Reload **/
jQuery(document).bind('keydown', 'r', function (evt){ 
    console.log("r");
    window.location.reload(true);
});

/** Find-url **/
jQuery(document).bind('keydown', 'g', function (evt){ 
    console.log("g");
});

/* Movement */
/** Forward a line **/
jQuery(document).bind('keydown', 'Ctrl+n', function (evt){ 
    console.log("C-n");
});

/** Back a line **/
jQuery(document).bind('keydown', 'Ctrl+p', function (evt){ 
    console.log("C-p");
});

/** Open a URL **/
jQuery(document).bind('keydown', 'Ctrl+x', function (evt){ 
    console.log("C-x");
    modifiers["ctrlx"] = true;
});

jQuery(document).bind('keydown', 'Ctrl+f', function (evt){ 
    if (modifiers["ctrlx"]) {
	console.log("C-x C-f");
	conkerChrome.show();
    }
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

jQuery(document).bind('keydown', 'F', function (evt){ 
    console.log("F");
    currentCommand = highlightLinks;
    highlightLinks.activate();
});
