// This file contains utility functions that are not related to
// the objects used by the game.

var blue      = "rgb(" + 21 + "," + 0 + "," + 129 + ")";
var lblue     = "rgb(" + 190 + "," + 208 + "," + 253 + ")";
var lblue2    = "rgb(" + 52 + "," + 238 + "," + 225 + ")";
var lblue3    = "rgb(" + 72 + "," + 218 + "," + 218 + ")";
var sblue     = "rgb(" + 0 + "," + 0 + "," + 255 + ")";
var rioblue   = "rgb(" + 41 + "," + 109 + "," + 179 + ")";
var rioblue2  = "rgb(" + 18 + "," + 79 + "," + 132 + ")";
var rioblue3  =  "rgb(" + 47 + "," + 127 + "," + 190 + ")";

var sred       = "rgb(" + 255 + "," + 0 + "," + 0 + ")";
var red       = "rgb(" + 254 + "," + 39 + "," + 54 + ")";
var red2      = "rgb(" + 246 + "," + 8 + "," + 55 + ")";
var salmon    = "rgb(" + 255 + "," + 160 + "," + 122 + ")";
var crimson   = "rgb(" + 220 + "," + 20 + "," + 60 + ")";
var pinkred   =  "rgb(" + 255 + "," + 85 + "," + 127 + ")";

var yellow    = "rgb(" + 238 + "," + 238 + "," + 44 + ")";
var dyellow   = "rgb(" + 222 + "," + 193 + "," + 13 + ")";
var cyellow   = "rgb(" + 254 + "," + 207 + "," + 65 + ")";
var lyellow   = "rgb(" + 255 + "," + 255 + "," + 153 + ")";
var dbyellow   = "rgb(" + 222 + "," + 193 + "," + 50 + ")";
var dbyellow2   = "rgb(" + 242 + "," + 213 + "," + 70 + ")";

var sgreen     = "rgb(" + 0 + "," + 255 + "," + 0 + ")";
var green     = "rgb(" + 50 + "," + 210 + "," + 140 + ")";
var green2    = "rgb(" + 48 + "," + 131 + "," + 87 + ")";
var lgreen    = "rgb(" + 135 + "," + 253 + "," + 177 + ")";
var dgreen    = "rgb(" + 25 + "," + 113 + "," + 9 + ")";
var limegreen = "rgb(" + 50 + "," + 205 + "," + 50 + ")";
var riogreen  =  "rgb(" + 0 + "," + 165 + "," + 79 + ")";

var brown     = "rgb(" + 130 + "," + 25 + "," + 21 + ")";
var brown2    = "rgb(" + 182 + "," + 18 + "," + 56 + ")";
var brown3    = "rgb(" + 206 + "," + 0 + "," + 74 + ")";
var brown4    = "rgb(" + 132 + "," + 27 + "," + 66 + ")";
var lbrown    = "rgb(" + 194 + "," + 126 + "," + 65 + ")";
var sienna    = "rgb(" + 160 + "," + 82 + "," + 45 + ")";
var sracz     = "rgb(" + 93 + "," + 74 + "," + 31 + ")";
var lsrach    = "rgb(" + 195 + "," + 112 + "," + 22 + ")";


var pink      = "rgb(" + 255 + "," + 5 + "," + 179 + ")";
var lpink     = "rgb(" + 247 + "," + 216 + "," + 195 + ")";
var pink2     =  "rgb(" + 255 + "," + 127 + "," + 255 + ")";
var pink3     =  "rgb(" + 255 + "," + 200 + "," + 255 + ")";

var purple    = "rgb(" + 141 + "," + 25 + "," + 196 + ")";
var purple2   = "rgb(" + 189 + "," + 13 + "," + 156 + ")";
var lpurple   = "rgb(" + 172 + "," + 100 + "," + 236 + ")";
var blackprpl = "rgb(" + 65 + "," + 38 + "," + 57 + ")";
var blackprpl2 = "rgb(" + 105 + "," + 78 + "," + 97 + ")";
var blackprpl2 = "rgb(" + 125 + "," + 98 + "," + 117 + ")";

var grgreen   =  "rgb(" + 143 + "," + 166 + "," + 124 + ")";
var nvgreen   =  "rgb(" + 54 + "," + 81 + "," + 88 + ")";
var lfngreen  =  "rgb(" + 204+ "," + 180 + "," + 48 + ")";

var granat    =  "rgb(" + 72 + "," + 90 + "," + 152 + ")";

var lavender  = "rgb(" + 200 + "," + 200 + "," + 255 + ")";


/* The below function generates fixed sets of colors for each 
difficulty level (i.e., dimension). These colors have been manually checked to form pleasing compositions.

cc is a reference to one dimentional array which stores strings
for rgb values (rowwise) of all the used colors */

function getProperColors(dim, subDim, cc){

    /* It turns out that the number of colors is determined by the 
       subDim. */

    if (subDim == 2) {
        cc[0] = lyellow;
	cc[1] = red2;         // red2 is reasonably good
	
	cc[2] = limegreen;    // limegreen is good too
	cc[3] = rioblue;
    } else if ( subDim == 3 ){
        
        cc[0] = lyellow;
	cc[1] = pink2;
	cc[2] = red;
	
	cc[3] = lgreen;    // limegreen is good too
	cc[4] = sgreen;
	cc[5] = dgreen;

	cc[6] = brown2
	cc[7] = grgreen;
	cc[8] = nvgreen;;

    } else if (subDim == 4) {
	  
        cc[0] = lyellow;
	cc[1] = pink2;
	cc[2] = red;
	cc[3] = brown2;	
	
	cc[4] = lgreen;    // limegreen is good too
	cc[5] = sgreen;
	cc[6] = riogreen;
	cc[7] = dgreen;

	cc[8] = lpink;
	cc[9] = lsrach;
	cc[10] = sracz;
	cc[11] = granat;

	cc[12] = dbyellow;
	cc[13] = lavender;
	cc[14] = purple2;
	cc[15] = blackprpl2;
    } else {
	var msg = "Utils6.js: getProperColors(_, _, cc): -> Not supported subSquare dimension of " + subDim + " given. Unable to generat puzzle's colors.";
	console.log(msg);
	throw msg;
    }
}

/* The below function generates random colors */

function getRandomColors(dim, subDim, cc){

    // legth of cc is expected to be equal to subDim^2 
    var lcc = subDim*subDim;

    /* We simply fill the given array */
    
    for (q=0; q<lcc;q++){
         var r = Math.floor(Math.random()*256);
	 var g = Math.floor(Math.random()*256);
	 var b = Math.floor(Math.random()*256);
	 cc[q]="rgb(" + r + "," + g + "," + b + ")";
   	 }
}

/*      
The below helper function looks into the web-page's main url (stored under window.location.href)
and retrieves parameter values after the last '?' mark.
*/

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
    .substr(1)
        .split("&")
        .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
    return result;
}

/* The below helper function truncates the given string after the first ? mark 
(excluding the mark) */

truncateHref = function(str){
    str = str.substring(0, str.indexOf('?'));
    return str;
}


/* This function returns a deep copy of a two dimentional array;
strangely enough deep copy is a difficult thing in JavaScript; I 
need only this special case. */

copyArray = function(arr){
    var len = arr.length,
    copy = new Array(len); // boost in Safari
    for (var i=0; i<len; ++i) {
	 copy[i] = arr[i].slice(0);
        }

    return copy;
}
