
// Creating a class OscarsSquare


var OscarsSquare = function(dim, subDim) {

    console.log("Creating a new square " + dim + ", " + subDim);

    if (typeof dim == 'number'){

	if ((dim % subDim) != 0 ){
	    var msg = "OscarsSquare(dim, subDim): the sub-square dimension  has to divde the size.";
	    console.log(msg);
	    throw msg;
	}
    
	this.dim = dim;
	this.subSquareDim = subDim;

	this.M = OscarsSquare.createInitialBoard(dim, subDim);

    // generate a random array of colors
	var m2 = subDim * subDim;
	var cc = new Array([m2]);
	getProperColors(this.dim, this.subSquareDim, cc);
	this.colors = cc;
    } else if (Array.isArray(dim) == true){

/**
 * In this interpretation of the arguments:
 * 
 * @param M            The Matrix to which the the game's square will be set to.
 * @param subSquareDim The sub-square dimension.
 */
	this.dim = dim.length; // naming is weird -- but correct
	this.subSquareDim = subDim;
	this.M = dim.slice(0);

    // generate a random array of colors
	var m2 = subDim * subDim;
	var cc = new Array([m2]);
	getProperColors(this.dim, this.subSquareDim, cc);
	this.colors = cc;

    } else {
	console.log("OscarsSquare(_, -): the first parameter has type " + (typeof dim));
	var msg = "OscarsSquare(_, _): the first parameter must be number or array (matrix).";
	throw msg;
    }
};

OscarsSquare.prototype.getDim = function(){
    return this.dim;
}

OscarsSquare.prototype.getSubDim = function(){
    return this.subSquareDim;
}

OscarsSquare.prototype.getM = function(){
    return this.M;
}

// Static function
OscarsSquare.createInitialBoard = function(dim, subSquareDim){
    var M = new Array([dim]);
    for (k =0; k < dim; k++){
        M[k] = new Array([dim]);
	for (s=0; s < dim; s++){
            M[k][s]=0;
	}
    }
    var L = Math.floor(dim/subSquareDim);
    var m = subSquareDim;
    
    for (k=0; k < m; k++){
	 for (l=0; l < m; l++){
              for (s = k*L; s < (k+1)*L; s++){
		   for (r = l*L; r < (l+1)*L; r++){
		       M[r][s]= (Math.floor(r/L)-1)*m + Math.floor(s/L) + m; // Don't ask me how I got this
		   }
	      }
	  }
    }

    return M;
};

/**
 * This is a utility function which given a matrix M determines how many square segments per side M contains.
 * This function should be used sparingly as it has to determine the maximum of all entries in M. The only need
 * for it arises at OscarSquare object construction time, so indeed, it will be used sparingly and the impact
 * on the performance will negligible.<br><br>
 *  
 * @param M The matrix whose sub-square dimension is to be determined. 
 */
// Static function
OscarsSquare.determineSubsquareDim = function(M){ // M is a matrix representing the game (an  array)

    var mm = 0;
    for (var t = 0; t < M.length; t++){
        for (var u = 0; u < M.length; u++){
            if (M[t][u] > mm){
                mm = M[t][u];
	       }
	}
    }

    subSquareDim = Math.floor(Math.sqrt(mm+1));
    return subSquareDim;
}

OscarsSquare.prototype.toString = function(){
    var str = "";
    for (s=0; s<this.dim; s++){
        for (r=0; r<this.dim;r++){
             str += this.M[s][r] +  " ";
	}
	str += "</br>";
    }
    return str;
};


OscarsSquare.prototype.shift = function(rc, num, dir) { // arguments are all integers	
// rc is the row column indicator 1 = row, -1 = column
// num is the number of the object indicated by rc -- an integer from 0 to n
// dir is the direction; for rows: 1 -right, -1 -left; for cols: 1 up, -1 down
// 

 var n = this.dim;

 if ((rc != 1 && rc != -1) ||  (dir != 1 && dir != -1)){
	 var msg = 
	"The row/column and direction arguments to OscarsSquare::shift must be 1 or -1.";
         throw msg;
    }
 
 if (num < 0 || num > n-1 ){
	var msg = "OscarsSquare.shift: The row/col index is 0 based; it must be a number between \"0 and n-1\"";
        throwRuntimeException(msg);
    }

// Shift row to the left.
 if (rc ==1 && dir ==-1 ) {
     var tmp = this.M[num][0];
     for(s=0; s<n-1; s++){
         this.M[num][s] = this.M[num][s+1];
	}
     this.M[num][n-1] = tmp;
    }

// Shift row to the right.
 if (rc ==1 && dir == 1 ) {
     var tmp = this.M[num][n-1];
     for(s=0; s<n-1; s++){
	 this.M[num][n-s-1] = this.M[num][n-s-2];
        }
     this.M[num][0] = tmp;
   }
	
// Shift column to the north
if (rc ==-1 && dir == 1 ) {
    var tmp = this.M[0][ num];
    for(s=0; s<n-1; s++){
        this.M[s][num]= this.M[s+1][num];
        }
	this.M[n-1][num]= tmp;
    }	

// Shift column to the south
if (rc ==-1 && dir == -1 ) {
    var tmp = this.M[n-1][num];
    for(s=0; s<n-1; s++){
        this.M[n-1-s][ num]=this.M[n-2-s][num];
       }
    this.M[0][num]=tmp;
   }

  return this.M; 
};
// End of shift

// This is a version of shift which moves diagonals
// This function expects TRANSLATED values for the indicator
// argument (arg1). It could be thought of as providing service
// only if its clients nicely specify what kind of an object they
// want to shift (in this case diagonals), and the index of the object to be shifted. The
// index starts from 0.
	
OscarsSquare.prototype.shiftD = function(whichD, num, dir){
// when whichD =  1 we're dealing with this diagonal /
// when whichD = -1 we're dealing with this diagonal \
// the num indicator is 0-based
// dir = 1 shift up
// dir = -1 shift down
		
var n = this.dim;
			
if (whichD != 1 && whichD != -1) {
    var msg = "OscarsSquare.shiftD: The first argument to OscarsSquare.shiftD must be 1 or -1.";
    throw msg;
   }	
	
    
if (num < 0 && num > 2*(n-1)) {
    var msg = "OscarsSquare.shiftD: The second argument to OscarsSquare.shiftD must be 0-based; a number between 0 and 2*(n-1).";
    throw msg;
   }	
    
if (dir != 1 && dir != -1) {
    var msg = "OscarsSquare.shiftD: The third argument to OscarsSquare::shiftD must be 1 or -1";
    throw msg;
   }
    
if (whichD == 1){ // ********** LET'S HANDLE THE / DIAGONALS FIRST *************** //
    
    // Let's handle the upward movement
    if (num <= n-1 && dir == 1){
        var k = num;
        var tmp = this.M[0][k];
	for (s=0; s < k; s++){
	     this.M[s][k-s] = this.M[s+1][k-1-s];
	    }
        this.M[k][0]= tmp;
       }

   // Handling the / diagonal up movement from k=n to 2*(n-1)
   if (num > n-1 &&  num <= 2*(n-1)&& dir == 1){
       var k = num;
       var l = k - (n-1);
       var tmp = this.M[l][n-1];
       for (s=n-1-l; s > 0; s--){
	   // Easier to debug
	   var old_val = this.M[n-1-s][l+s];
	   var new_val = this.M[n-s][l+s-1];
	   this.M[n-1-s][l+s]=new_val;
	  }
       this.M[n-1][l] = tmp;
      }
	
    // Now let's handle the downward movement
    if (num <= n-1 && dir == -1){
	var k = num;
	var tmp = this.M[k][0];
	for (s=k-1; s >= 0; s--){
	    var old_value =  this.M[s+1][k-1-s];
	    var new_value = this.M[s][k-s];
	    this.M[s+1][ k-1-s] = this.M[s][ k-s];	 
	   }
	this.M[0][ k] = tmp;
       }
	
	// Handling the / diagonal downward movement from k=n to 2*(n-1)
     if (num > n-1 &&  num <= 2*(n-1)&& dir == -1){
	 var k = num;
	 var l = k - (n-1);
	 var tmp = this.M[n-1][ l];
	 for (s=1; s <= n-1-l; s++){
	     // Easier to debug
	     var new_val = this.M[n-1-s][ l+s];
	     var old_val = this.M[n-s][ l+s-1];
	     this.M[n-s][ l+s-1] = new_val;
             }
	  this.M[l][ n-1] = tmp;
	  }
    }
    
    if (whichD == -1){ // ********** LET'S HANDLE THE \ DIAGONALS *************** //
    	
    	// INGENIOUS TRICK: According to the calculations we need to transform point (a, b) --> (-b+ n-1, a)
    	// That's it!
        
    // Let's handle the upward movement
	if (num <= n-1 && dir == 1){
		var k = num;
	//	var tmp = this.M[0][ k];
		var tmp = this.M[-k+n-1][ 0];
		for (s=0; s < k; s++){
		     // this.M[s][ k-s] = this.M[s+1][ k-1-s];
		     this.M[s-k+n-1][ s] = this.M[  s-k+1 + n-1][  s+1];	
		    }
		this.M[n-1][ k] = tmp;
	   }
	
	// Handling the \ diagonal up movement from k=n to 2*(n-1)
	if (num > n-1 &&  num <= 2*(n-1)&& dir == 1){
	    var k = num;
	    var l = k - (n-1);
	    // var tmp = this.M[l][ n-1];
		
	    var tmp = this.M[0][ l];
	    for (s=n-1-l; s > 0; s--){
	         // Easier to debug
	         // var old_val = this.M[n-1-s][ l+s];
	         var old_val = this.M[-l-s + n -1][n-1-s];
		 // var new_val = this.M[n-s][ l+s-1];
	         var new_val = this.M[-l-s+n][ n-s];		 
		 this.M[-l-s + n -1][ n-1-s] = new_val;
		}
		
	     // this.M[n-1][ l] =  tmp;
	     this.M[-l+n-1][ n-1] =  tmp;
	    }
	
	// Now let's handle the downward movement
	if (num <= n-1 && dir == -1){
	    var k = num;
	    // var tmp = this.M[k][ 0];
	    var tmp = this.M[n-1][ k];
	    for (s=k-1; s >= 0; s--){
		// var old_value =  this.M[s+1][ k-1-s];
		// var new_value = this.M[s][ k-s];
		var old_value =  this.M[-k+s+n][ s+1];
	        var new_value = this.M[s-k+n-1][ s];

		this.M[-k+s+n][ s+1] = new_value;	 
	        }
		
	    //this.M[0][ k] = tmp];
	    this.M[-k+n-1][ 0] = tmp;
	   }
	
	// Handling the \ diagonal downward movement from k=n to 2*(n-1)
	if (num > n-1 &&  num <= 2*(n-1)&& dir == -1){
	    var k = num;
	    var l = k - (n-1);
	    //var tmp = this.M[n-1][ l];
		
	    var tmp = this.M[-l+n-1][ n-1];
	    for (s=1; s <= n-1-l; s++){
	         // Easier to debug
	         //var new_val = this.M[n-1-s][ l+s);
		 // var old_val = this.M[n-s][ l+s-1);
			
		  var new_val = this.M[-l-s+n-1][ n-1-s];
		  var old_val = this.M[-l-s+n][  n-s];
			
		  // this.M[n-s][ l+s-1] = new_val;
		  this.M[-l-s+n][ n-s] = new_val;
		 }
		//this.M[l][ n-1] = tmp;
	    this.M[0][ l] = tmp;
	   }
    }
    
    return this.M;
   }
// End of shiftD

// This function takes as an argument a GameShift object which contains all the information
// about the object & direction of the shift. It then performs the shift and returns the
// reference of the resulting matrix

OscarsSquare.prototype.shiftG = function(gs) { // gs is a GameShift object

    var rc  = gs.getRowColIndicator();
    var dir = gs.getDirIndicator();
    var r   = gs.getRowColIndex();
		
    if (rc < 0 || rc > 4){
	msg = "OscarsSquare.shiftG(GameShift gs): Incorrect value of the code for the object (row, col, diag, ring) to be shifted has been passed in.";
	throw msg;
      }
		
    var trc = rc; // translated rc	
    if (rc == 0){  // We've got a column to shift
	trc = -1;	
			                       // When rc = 1, trc = rc (row to shift)
       } else if (rc == 2){    // We've got a diagonal \ to shift
	trc = -1;   
       } else if (rc == 3){    // We've got a diagonal / to shift
	 trc = 1;  
       }                       // When rc = 4, trc = rc (ring to rotate)
		
       tdir = dir; // translated dir
       if (dir == 0){
	   tdir = -1;
	  }
		
       if (rc <= 1){                   // In these two cases the shift function takes are of columns and rows
	   this.shift(trc, r, tdir);
	  } else if( rc == 2 || rc == 3){ // Here the function shiftD take care of diagonals \ and /  rescpectively
			this.shiftD(trc, r, tdir);
	  } else {                        // It's gotta be a ring to rotate, so shiftR gets invoked
			this.shiftR(trc, r, tdir);
	  }
    
 return this._M;
}

OscarsSquare.prototype.draw = function(canvas){

    var x_off = 10;
    var y_off = 10;

    var cx  = canvas.getContext("2d");
    var width = canvas.width   -  2*x_off;
    var height = canvas.height -  2*y_off;
	
	// Draw the white background
	cx.lineWidth = 5;
	cx.fillStyle="#FFFFFF";
	cx.fillRect(0,0,width+2*x_off,width+2*y_off);
    
    cx.strokeStyle = "black";
    cx.lineWidth = 1;

    var n = this.dim;
    var m = this.subSquareDim;
    var w = Math.floor(width/n);
    var h = Math.floor(height/n);
    
    for (i = 0; i < n; i++){
	for (j = 0; j < n; j++){
            cx.rect(x_off + i*w, y_off +j*h, w, h);
	    cx.fillStyle=this.colors[this.M[j][i]];
	    cx.fillRect(x_off + i*w+1, y_off + j*h+1, w-2, h-2)
	    cx.stroke();
	}
    }

    // The last cell's borther needs to be redrawn again
    cx.rect(x_off + (n-1)*w, y_off + (n-1)*h, w, h)
    cx.stroke();

    // Draw the frame top:
    cx.beginPath();
    cx.lineWidth = 5;
    cx.strokeStyle = "black";
    cx.moveTo(0, 0);
    cx.lineTo(width + 2*y_off, 0);
    cx.stroke();

    cx.moveTo(width + 2*x_off, 0);
    cx.lineTo(width + 2*x_off, height + 2*y_off);
    cx.stroke();

    cx.moveTo(0, height + 2*y_off);
    cx.lineTo(width + 2*x_off, height + 2*y_off);
    cx.stroke();

    cx.moveTo(0, 0);
    cx.lineTo(0, height + 2*y_off);
    cx.stroke();
    
    cx.closePath();
	
	

    //Draw the lines delimiting the segments.
    //First horizontal
     
    for (s = 1; s < m; s++){
        cx.beginPath();
	cx.lineWidth = 3;
	cx.strokeStyle = "white";
	cx.moveTo(0+x_off, s*h*(n/m)+y_off-cx.lineWidth);
	cx.lineTo(n*w + x_off, s*h*(n/m)+y_off-cx.lineWidth);
	cx.stroke();
	cx.closePath();
	
        cx.beginPath();
	cx.strokeStyle = "black";
	cx.moveTo(0+x_off, s*h*(n/m)+y_off);
	cx.lineTo(n*w+x_off, s*h*(n/m)+y_off);
	cx.stroke();
	cx.closePath();
    }

 
    //Then vertical
       
    for (s = 1; s < m; s++){
        cx.beginPath();
	cx.lineWidth = 3;
	cx.strokeStyle = "white";
	cx.moveTo(s*w*(n/m)+x_off-cx.lineWidth, 0+y_off);
	cx.lineTo(s*w*(n/m)+x_off-cx.lineWidth, n*h + y_off);
	cx.stroke();
	cx.closePath();
	
        cx.beginPath();
	cx.strokeStyle = "black";
	cx.moveTo(s*w*(n/m)+x_off, 0+y_off);
	cx.lineTo(s*w*(n/m)+x_off, n*h + y_off);
	cx.stroke();
	cx.closePath();
    }



};


////////////////////////////////// END OF LIBRARY /////////////////////////////////////

/*******  TEST ******************

OscarsSquare.prototype.createControlButton = function(canvas, id){

    var cB = document.createElement("input");
    cB.setAttribute("type", "BUTTON");
    cB.setAttribute("id", id);
    cB.setAttribute("value", "Franek");
    cB.setAttribute("onClick", "oS.shift(-1,1,-1);oS.draw(canvas)");
    var gP = document.getElementById("game_panel");
    gP.appendChild(cB);
}

var oS = new OscarsSquare(4, 2);
var  n = oS.getDim();

// console.log(oS.getM().toString());
// console.log(OscarsSquare.determineSubsquareDim(oS.getM()));
// Writing the table with game board and buttons

var gWidth  = 600;
var gHeight = 600;

var dl_button_style = "style=\"text-align:left;width:10px;padding:0px;border:none;outline:none;background:white\"";
var dr_button_style = "style=\"text-align:right;width:10px;padding:0px;border:none;outline:none;background:white\"";

var up_button_style_1 = "style=\"width:65px\"";

document.write("<table id=\"game_panel\" border=\"1\" cellpadding = \"0px\" cellspacing=\"2px\">");

for (s=0; s<n; s++){         ///////// TOP ROW ////////////
    if (s == 0){
        document.write("<tr><td style=\"text-align:center\"><button id=\"shift_d_nw\" onClick=\"oS.shiftD(-1," + (n-1) + ", 1);oS.draw(canvas);\">&nwarr;</button></td>");
	
	for(r=0; r<n; r++){
            // diagonal cell left
	    if (r >= 1 && r <= n-2) {
		document.write("<td style=\"text-align:left\"><button id=\"shift_d_nw_"
			       + (n-1+r) + "\" onClick=\"oS.shiftD(-1," + (n-1+r)
			       + ", 1);oS.draw(canvas);\"" + dl_button_style
			       + ">&nwarr;</button></td>");
	       }
	    
	    // column cell up
            document.write("<td style=\"text-align:center\"><button id=\"shift_t_"
			   + r + "\" onClick=\"oS.shift(-1," + r
			   + ", 1);oS.draw(canvas);\""
			   + ((r == 0 || r == n-1) ?  up_button_style_1 : "") + ">&uarr;</button></td>");


	    // diagonal cell right
	    if (r >= 1 && r <= n-2) {
		document.write("<td style=\"text-align:right\"><button id=\"shift_d_ne_"
			       + r + "\" onClick=\"oS.shiftD(1," + r
			       + ", 1);oS.draw(canvas);\"" + dr_button_style
                               + ">&nearr;</button></td>");
	       }
	}
	
        document.write("<td style=\"text-align:center\"><button id=\"shift_d_ne\" onClick=\"oS.shiftD(1," + (n-1) + ", 1);oS.draw(canvas);\">&nearr;</button></td></tr>");
       }
    document.write("<tr>")   //////// END OF TOP ROW //////////
    
    document.write("<td><button id=\"shift_l_" +
		   s + "\" onClick=\"oS.shift(1,"
		   + s + ",-1);oS.draw(canvas);\">&larr;</button></td>");
    
    if (s == 0){
	document.write("<td rowspan=" + "\"" + n + "\""
		       + " colspan=" + "\"" + (n+2*(n-2)) 
		       + "\"" + "><canvas id="
		       + "\"theboard\""
		       +  " height=" + "\"" + gHeight + "\"" + " width="
		       + "\"" + gWidth + "\"" + "></td>"); 
       }
    document.write("<td><button id=\"shift_r_"
		   + s + "\" onClick=\"oS.shift(1,"
		   + s + ",1);oS.draw(canvas);\">&rarr;</button></td>");
    
    document.write("</tr>");


    if (s == n-1){ /////// BOTTOM ROW //////////
        document.write("<tr><td style=\"text-align:center\"><button id=\"shift_d_sw\" onClick=\"oS.shiftD(1," + (n-1) + ", -1);oS.draw(canvas);\">&swarr;</button></td>");
	
	for(r=0; r<n; r++){

            // diagonal cell left
	    if (r >= 1 && r <= n-2) {
		document.write("<td style=\"text-align:left\"><button id=\"shift_d_sw_"
			       + (n-1+r) + "\" onClick=\"oS.shiftD(1," + (n-1+r)
			       + ", -1);oS.draw(canvas);\"" + dl_button_style
			       + ">&swarr;</button></td>");
	    }
	    
            document.write("<td style=\"text-align:center\"><button id=\"shift_b_"
			   + r + "\" onClick=\"oS.shift(-1," + r
			   + ", -1);oS.draw(canvas);\">&darr;</button></td>");


	    // diagonal cell right
	    if (r >= 1 && r <= n-2) {
		document.write("<td style=\"text-align:right\"><button id=\"shift_d_se_"
			       + r + "\" onClick=\"oS.shiftD(-1," + r
			       + ", -1);oS.draw(canvas);\"" + dr_button_style
			       + ">&searr;</button></td>");
	       }  
	}
	
        document.write("<td style=\"text-align:center\"><button id=\"shift_d_se\" onClick=\"oS.shiftD(-1," + (n-1) + ", -1);oS.draw(canvas);\">&searr;</button></td></tr>");
       }          /////// END OF BOTTOM ROW
}

document.write("</table>");






//document.write("dimension = " + oS.dim + "</br>");
//document.write("sub-square dim = " + oS.subSquareDim + "</br>");
//document.write(oS.toString());
    
//oS.shift(1, 0, -1);
//oS.shiftD(1, 2, -1);
//document.write("</br>" + oS.toString());

var canvas = document.getElementById("theboard");
oS.draw(canvas);

//oS.createControlButton(canvas, "left_shift");

//var coord = canvas.getBoundingClientRect();
//document.write("left = " + coord.left + "</br>" +
//	       "top = " + coord.top + "</br>" +
//	       "right = " + coord.right + "</br>" +
//	       "bottom = " + coord.bottom + "</br>" +
//               "width = " + coord.width + "</br>" + 
//               "height = " + coord.height + "</br>");



*********** END OF TESTS ***********/

