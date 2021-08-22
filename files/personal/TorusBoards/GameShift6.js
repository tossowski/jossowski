// GameShift object encaptulates the notion of a "shift":
// the shifting of a row, column, diagonal or a ring.
const MAX_DIMENSION = 16;

const flagbit1 = 1;    // 2^^0    000...00000001
const flagbit2 = 2;    // 2^^1    000...00000010
const flagbit3 = 4;    // 2^^2    000...00000100
const flagbit4 = 8;    // 2^^3    000...00001000


GameShift = function(n) {
// n is the size of the underlying OscarsSquare Object
    if ( n > MAX_DIMENSION) {
        var msg = "GameShift: Grid dimension must be an even number <= 16.";
	throw msg;
    }

    this.dim = n;
    this.mask = 0;
    // Lowest three bits 000 --> column is shifted                    // 0
    // lowest three bits 001 --> row is shifted                       // 1
    // lowest three bits 010 --> \ general diagonal is shifted        // 2
    // lowest three bits 011 --> / general diagonal is shifted        // 3
    // lowest three bits 100 --> @ ring is shifted                    // 4
		
		// The next one bit specifies direction
		// Hence the default GameShift is to shift column 0 down
};


// s is a mask -- an integer:
// The mask holds all the information about what's being moved and how
GameShift.prototype.setShift = function(s){
		
    var temp1 = s & ~flagbit1;
    temp1 = temp1 & ~flagbit2; 
    temp1 = temp1 & ~flagbit3;
    temp1 = temp1 & ~flagbit4; // zero the first four bits
    var rc_index = temp1 / 16;

    //// NOW LET'S CHECK WHETHER THE VALUE GIVEN TO US MAKES SENSE
        
    // We're dealing with a row or a column
    if ( ((s & flagbit2) == 0) && ((s & flagbit3) == 0) && (rc_index > this.dim - 1) ){
           var msg = "GameShift.setShift: setting shift on a row/column of a too large index.";
           throw msg;
       }
        
        
    // We're dealing with a generalized diagonal
    if ( ((s & flagbit2) == 1) && ((s & flagbit3) == 0) && (rc_index > 2*(this.dim - 1)) ){
           var msg = "GameShift.setShift: setting shift on a generalized diagonal of a too large index.";
           throw msg;
          }       
        
 
     // We're dealing with a ring shift
     if ( ((s & flagbit1) == 0) && ((s & flagbit2) == 0) &&  ((s & flagbit3) == 1) && (rc_index > (this.dim - 1)/2  - 1) ){
	       var msg = "GameShift.setShift: setting shift on a ring of a too large index.";
	       throw msg;
        }  
        
     this.mask = s;
}


// Retrieves from the mask of the object which is being moved
// row index can take values           0 ... n-1
// col index can take value            0 ... n-1
// diag index can take value           0 ... 2(n-1)
// ring index can take value from      0 ... (n-1)/2 - 1

GameShift.prototype.getRowColIndex = function(){
	   var temp1 = this.mask  & ~flagbit1;
	       temp1 = temp1 & ~flagbit2; 
	       temp1 = temp1 & ~flagbit3;
	       temp1 = temp1 & ~flagbit4;// zero the first four bits
           return (temp1 / 16);
}


GameShift.prototype.getRowColIndicator = function(){ // 0 - column; 1 - row; 2 - diagonal \, 3 - diagonal /, 4 - ring
    return (this.mask & (flagbit1 | flagbit2 | flagbit3));
}


GameShift.prototype.getDirIndicator= function(){ // 0 - down/left, 1 - up/right
    return (this.mask & flagbit4)/8;
}
	
GameShift.prototype.toString = function(){
		
	var r = this.getRowColIndex();
	var human_readable_text = new String();
	
	if (this.getRowColIndicator() == 0 && this.getDirIndicator() == 0){
		human_readable_text += "c " + r + " down";
	} else if (this.getRowColIndicator() == 0 && this.getDirIndicator() == 1){
		human_readable_text += "c " + r + " up";
	} else if (this.getRowColIndicator() == 1 && this.getDirIndicator() == 0){
		human_readable_text += "r " + r + " left";
	} else if (this.getRowColIndicator() == 1 && this.getDirIndicator() == 1){	
		human_readable_text += "r " + r + " right";	
	} else if (this.getRowColIndicator() == 2 && this.getDirIndicator() == 0){
		human_readable_text += "d \\ " + r + " down";	
	} else if (this.getRowColIndicator() == 2 && this.getDirIndicator() == 1){
		human_readable_text += "d \\ " + r + " up";	
	} else if (this.getRowColIndicator() == 3 && this.getDirIndicator() == 0){
		human_readable_text += "d / " + r + " down";	
	} else if (this.getRowColIndicator() == 3 && this.getDirIndicator() == 1){
		human_readable_text += "d / " + r + " up";				
	} else if (this.getRowColIndicator() == 4 && this.getDirIndicator() == 0){	
		 human_readable_text += "g " + r + " ccw"; // Looks like I got it backwards - manually overwritten 07/18/2016
	} else if (this.getRowColIndicator() == 4 && this.getDirIndicator() == 1){	
		 human_readable_text += "g " + r + " cw";	 // Looks like I got it backwards - manually overwritten 07/18/2016
	} else {
	  var msg = "GameShift.toText: encountered an unknown mask.";
	  throw msg;
	}
	
	return human_readable_text;
	}


GameShift.prototype.getShift = function(){
	return this.mask;
}


// IMPORTANT EXPLANATION: "\" diagonals are counted from the bottom left corner staring from 0:
// Cols are counted from the left from 0, ..., NN-1
// Rows are counted from the top from  0, ..., NN-1

// 0, 1, 2, ..., NN - 1 (the main "\" diagonal), ..., 2(NN-1) [ 0-th, and 2*(NN-1) diagonals are single cells]
// Similarly, "/" diagonal are counted from the top left corner starting from 0:
// 0, 1, 2, ..., NN-1 (the main "/" diagonal), ..., 2(NN-1) [0-th, and 2*(NN-1) diagonals are single cells]

// Rings are counted from the center from 0 to NN/2 - 1 (NN is assumed to be even; there NN/2 rings)

// bearing is a string, i is an int
GameShift.prototype.fromCompassRose = function(bearing, i){
	   if (bearing == "N"){
		   if (i > this.dim) {
		       var msg = "GameShift.fromCompasRose: Too high row column index.";
		       throw msg;
		   }
		   return (16*i + 8); // Column i up  (8 = 1000 in binary)
	   } else if ( bearing == "S"){
		   if (i > this.dim) {
		       var msg = "GameShift.fromCompasRose: Too high row column index.";
		       throw msg;
		      }			   
		   return (16*i); // Column i down (0 = 0000 in binary)
	   } else if ( bearing == "W"){
		   if (i > this.dim) {
		       var msg = "GameShift.fromCompasRose: Too high row column index.";
		       throw msg;
		      }
		   return (16*i + 1);    // row i left (1 = 0001 in binary)
	   } else if ( bearing == "E"){
		   if (i > this.dim) {
		      var msg = "GameShift.fromCompasRose: Too high row column index.";
		      throw msg;
		      }			   
		   return (16*i + 9);// row i right (7 = 1001 in binary)
		   
		 // For diagonal shifts the maximal index is different
	   } else if ( bearing == "NW"){
	       if (i > 2*(this.dim - 1)) {
		   var msg = "GameShift.fromCompasRose: Too high diagonal index.";
	           throw msg;
			     }			   
	      return (16*i + 10);//  diagonal \ up (10 = 1010 in binary)			     
	   } else if ( bearing == "SW"){
		   if (i > 2*(this.dim - 1)) {
		       var msg = "GameShift.fromCompasRose: Too high diagonal index.";
		       throw msg;
		    }			   		   
		   return (16*i + 3);//  diagonal / down (3 = 0011 in binary)				   
	   } else if ( bearing == "NE"){
		   if (i > 2*(this.dim - 1)) {
		       var msg = "GameShift.fromCompasRose: Too high diagonal index.";
		       throw msg;
	          }		   
		   return (16*i + 11);//  diagonal / up (6 = 1011 in binary)				   
	   } else if ( bearing == "SE"){
		   if (i > 2*(this.dim - 1)) {
	               var msg = "GameShift.fromCompasRose: Too high diagonal index.";
		       throw msg;
	          }				   
	       return (16*i + 2);//  diagonal \ down (2 = 0010 in binary)	
	       
	     // The maximal index is different for the rotations
	   } else if ( bearing == "RCCW"){  // Rotation Clockwise
		   if (i > (this.dim)/2 - 1) {
		       msg = "GameShift.fromCompasRose: Too high rotation index.";
		       throw msg;
	          }
		   
		   return (16*i + 4);          //   4 = 0100  -- rotation in direction 0 is counterclockwise
	   }
	   else if ( bearing == "RCW"){  // Rotation Counter Clockwise
		 if (i > (this.dim)/2 - 1) {
		     var msg = "GameShift.fromCompasRose: Too high rotation index.";
		     throw msg;
	        }
		   return (16*i + 12);          //   12 = 1100 -- rotation in direction 1 is clockwisre
	      }
  
	   // if we are here, something went wrong
	   var msg = "GameShift::fromCompasRose: Detected incorrect translation of the bearing and index into a mask.";
	   throw msg;    
}
	

GameShift.prototype.invert = function(){
	  var n = this.dim;
	  var i = this.getRowColIndex();
	   // We have to figure out what the mask is
	  var new_mask = this.mask;

	  if (this.mask == 16*i + 8)       // N
	      new_mask = 16*i;        // S
	  else if (this.mask == 16*i)      // S
	      new_mask = 16*i + 8;      // N
          else if (this.mask == 16*i + 1)  // W
              new_mask = 16*i + 9;      // E
          else if (this.mask == 16*i + 9)    // E
              new_mask = 16*i +  1;      // W
          else if (this.mask == 16*i + 10) // NW
              new_mask= 16*i + 2;   // SE
          else if (this.mask == 16*i + 2)   // SE
              new_mask = 16*i + 10;  // NW
          else if (this.mask == 16*i + 11)  // NE
              new_mask = 16*i + 3;  // SW
          else if (this.mask == 16*i + 3)  // SW
              new_mask = 16*i + 11; // NE
          else if (this.mask == 16*i + 4)  // Rotation Clockwise
              new_mask = 16*i+12;   // Rotation CCW
          else if (this.mask == 16*i + 12) // Rotation CCW
              new_mask = 16*i+ 4; // Rotation CW
		    
	  var gs = new GameShift(n);   
	  gs.setShift(new_mask);
          return gs;
}


// The mask holds all the information on what's being moved
// and how

GameShift.prototype.cloneMe = function(){
 var  gs = new GameShift(this.dimension);
 gs.setShift(this.mask);
 return gs;
}

 /**
  * 
  * The below function is needed to allow for random scrambling of a game's matrix.
  * It generates an array of all possible game shifts in a shift class.
  * 
  * @param n   The main dimension of the game's square
  * @param m   The shift sub-class to be listed ("main", "main + diags", "main + rotations", "all").
  * @return    The list of all possible game shifts.
  */

GameShift.generateAllPossibleGameShifts = function(n, shiftClass){
		
// I know, weird that  fromCompassRose is not static. As a result
// I have to create and "mother" object GS to use the services of
// that method (forgot why I made fromCompassRose not static and 
// don't want to mess with this now -- 07/29/2016).
		
		
    var subclasses = new Array();
		
    if (shiftClass == "main"){                        // main
	subclasses.push("N"); subclasses.push("S"); subclasses.push("E"); subclasses.push("W");
       } else if (shiftClass == "main + diags") {     // main + diags
			subclasses.push("N"); subclasses.push("S"); subclasses.push("E"); subclasses.push("W");   
			subclasses.push("NE"); subclasses.push("NW"); subclasses.push("SE"); subclasses.push("SW");   			      
		   } else if (shiftClass == "main + rotations"){  // main + rotations
			subclasses.push("N"); subclasses.push("S"); subclasses.push("E"); subclasses.push("W");   
			subclasses.push("RCW"); subclasses.push("RCCW"); 				      
		   } else if (shiftClass == "all"){              // all
			subclasses.push("N"); subclasses.push("S"); subclasses.push("E"); subclasses.push("W");   
			subclasses.push("NE"); subclasses.push("NW"); subclasses.push("SE"); subclasses.push("SW");   			   
			subclasses.push("RCW"); subclasses.push("RCCW");   
		   } else {
			 msg = "GameShift.generateAllPossibleShifts: Internal Error: There is no shift subclass " + shiftClass + ".";
			 throw msg;
		   }
		
		var GS = new GameShift(n);
		var ret = new Array();
		
		var lastIndex = -1;

              
       for (var qq=0; qq < subclasses.length; qq++){
            if (subclasses[qq].length == 1){  //We're lucky that we can distinguish between all the sift types by the length of their description strings
	        	 // main shifts
	        lastIndex = n - 1 ; // 0 - based
	       } else if (subclasses[qq].length == 2){
	        	 // diagonals
	        	 lastIndex  = 2*(n-1); // 0 - based
	       } else if (subclasses[qq].length > 2){
	        	 // rotations
	        	 lastIndex = (n/2)-1; // 0 - based
	       }

	       for (var ff = 0; ff <= lastIndex; ff++){
		    var mask = GS.fromCompassRose(subclasses[qq], ff);
		    var gs = new GameShift(n);   
		    gs.setShift(mask);
		    ret.push(gs);	
		   }	
	}
		  
        return ret;
}


	
/***********   TESTS ***********************************88
	
		// Note: indexes are 0 based
var NN = 4;
var gs = new GameShift(NN);
		
console.log("North shift column 0");
var s = gs.fromCompassRose("N", 0);
gs.setShift(s);
console.log(gs.getRowColIndicator() + ", " + gs.getRowColIndex() + ", " + gs.getDirIndicator());
console.log(gs.toString());
		
console.log("South shift column 3:");		
s = gs.fromCompassRose("S", 3);
gs.setShift(s);
console.log(gs.getRowColIndicator() + ", " + gs.getRowColIndex() + ", " + gs.getDirIndicator());
console.log(gs.toString());
		
console.log("Left shift row 2:");		
s = gs.fromCompassRose("W", 2);
gs.setShift(s);
console.log(gs.getRowColIndicator() + ", " + gs.getRowColIndex() + ", " + gs.getDirIndicator());
console.log(gs.toString());		
		
console.log("Right shift row 1:");		
s = gs.fromCompassRose("E", 1);
gs.setShift(s);
console.log(gs.getRowColIndicator() + ", " + gs.getRowColIndex() + ", " + gs.getDirIndicator());
console.log(gs.toString());	
		
		
console.log();
console.log("****** TESTING DIAGONAL SHIFTS ********");
console.log();



console.log("/ diagonal No. 0  up:");		
s = gs.fromCompassRose("NE", 0);  // row/col index irrelevant
gs.setShift(s);
console.log(gs.getRowColIndicator() + ", " + gs.getRowColIndex() + ", " + gs.getDirIndicator());
console.log(gs.toString());

console.log("/ diagonal No. " + (2*(NN-1)) +  "  down:");		
s = gs.fromCompassRose("SW", 2*(NN-1)); // row/col index irrelevant
gs.setShift(s);
console.log(gs.getRowColIndicator() + ", " + gs.getRowColIndex() + ", " + gs.getDirIndicator());
console.log(gs.toString());

console.log("\\ diagonal No. 3 down:");		
s = gs.fromCompassRose("SE", 3); // row/col index irrelevant
gs.setShift(s);
console.log(gs.getRowColIndicator() + ", " + gs.getRowColIndex() + ", " + gs.getDirIndicator());
console.log(gs.toString());	

console.log("\\ diagonal " + (NN-1) + " up:");	  // NW diagonal
s = gs.fromCompassRose("NW", NN-1); // row/col index irrelevant
gs.setShift(s);
console.log(gs.getRowColIndicator() + ", " + gs.getRowColIndex() + ", " + gs.getDirIndicator());
console.log(gs.toString());

// Testing the inverting operation


console.log();
console.log("****** TESTING ROTATIONS ********");
console.log();

console.log("Rotation of ring 0 clockwise:");		
s = gs.fromCompassRose("RCW", 0);
gs.setShift(s);
console.log(gs.getRowColIndicator() + ", " + gs.getRowColIndex() + ", " + gs.getDirIndicator());
console.log(gs.toString());

console.log("Rotation of the outer most ring  (No. " + (NN/2 -1) + ") counter-clockwise:");	
s = gs.fromCompassRose("RCCW", NN/2 - 1);
gs.setShift(s);
console.log(gs.getRowColIndicator() + ", " + gs.getRowColIndex() + ", " + gs.getDirIndicator());
console.log(gs.toString());

console.log();
console.log("*** TESTING THE INVERSION OPERATI0N ***");
console.log();

s = gs.fromCompassRose("NW", 2);
gs.setShift(s);
console.log(gs.toString() + " inverts to " + gs.invert().toString());

s = gs.fromCompassRose("W", 3);
gs.setShift(s);	
console.log(gs.toString() + " inverts to " + gs.invert().toString());		

s = gs.fromCompassRose("SW", NN-1);
gs.setShift(s);	
console.log(gs.toString() + " inverts to " + gs.invert().toString());

s = gs.fromCompassRose("S", 2);
gs.setShift(s);	
console.log(gs.toString() + " inverts to " + gs.invert().toString());		

s = gs.fromCompassRose("SE", NN-1); // SE Diagonal
gs.setShift(s);	
console.log(gs.toString() + " inverts to " + gs.invert().toString());		

s = gs.fromCompassRose("E", 3);
gs.setShift(s);	
console.log(gs.toString() + " inverts to " + gs.invert().toString());

s = gs.fromCompassRose("NE", 0);
gs.setShift(s);	
console.log(gs.toString() + " inverts to " + gs.invert().toString());

s = gs.fromCompassRose("N", 3);
gs.setShift(s);	
console.log(gs.toString() + " inverts to " + gs.invert().toString());


s = gs.fromCompassRose("RCW", 0);
gs.setShift(s);	
console.log(gs.toString() + " inverts to " + gs.invert().toString());


s = gs.fromCompassRose("RCCW", 1);
gs.setShift(s);	
console.log(gs.toString() + " inverts to " + gs.invert().toString());


console.log();
console.log("*** TESTING ALL POSSIBLE SHIFT GENERATION ***");
console.log();

console.log("*** MAIN n = 4 ***");
var shifts = GameShift.generateAllPossibleGameShifts(4, "main");
console.log("There are " + shifts.length + " main shifts.");
for (rr = 0; rr<shifts.length;rr++){
	console.log(shifts[rr].toString());
}

console.log("*** MAIN + DIAG n = 4 ***");
shifts = GameShift.generateAllPossibleGameShifts(4, "main + diags");
console.log("There are " + shifts.length + " main + diagoanl shifts.");
for (rr = 0; rr<shifts.length;rr++){
	console.log(shifts[rr].toString());
}

console.log("*** ALL n = 4 ***");
shifts = GameShift.generateAllPossibleGameShifts(4, "all");
console.log("There are " + shifts.length + " shifts.");
for (rr = 0; rr<shifts.length;rr++){
	console.log(shifts[rr].toString());
}

console.log("*** ALL n = 6 ***");
shifts = GameShift.generateAllPossibleGameShifts(6, "all");
console.log("There are " + shifts.length + " shifts.");
for (rr = 0; rr<shifts.length;rr++){
	console.log(shifts[rr].toString());
}		
		
		


***** END OF TESTS **************/
