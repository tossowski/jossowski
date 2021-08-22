/**
 * 1) The purpose of the Game object is to collect/encapsulate all natural functionality a single complete Oscar's Square
 * game should provide. The Game object keeps track of all the information generated in the course of a single game. It 
 * allows the user to save that information in a file (essentially all the moves the player has made), and read that information
 * from a saved file. A game can be played in two modes: 1) the EXPLORER mode where what normally is a destination matrix is the 
 * starting point for exploration of the grids that can be gotten to by performing the moves. The intention is that when an
 * interesting grid is found, the player saves it as the initial grid, reverses all the moves and poses the so obtained SOLVER game
 * as challenge. 2)  the SOLVER mode: this is the standard mode where the player is to bring the matrix to the original (simplest)
 * cannonical form (e.g. a grid consisting of 4 sub-square segments)<br><br>
 * 
 * 2) The main data fields of the Game object (which shed light on the object's workings) are<br>
 *    -- _name           (that name is appended by the exact date/time when saving a game)<br>
 *    -- _start          (the starting square of the game in either of the two modes)<br>
 *    -- _final          (the last state gotten in the process of playing the game)<br>
 *    -- _steps_made     (the sequence of GameShifts which when applied to the _start matrix, result inthe _final matrix)
 *    -- _current_step   (the "cursor" pointing to a particular move the player has made -- normally the last step made )<br>
 *    -- _solution       (the sequence of steps -- GameShifts -- needed to reach the destination grid)<br>
 *    -- _listeners      (a list of GameChangeListener objects interested in notifications about game state changes)<br><br>
 *    
 * <strong>NOTES:</strong><br><br>
 * 
 * As the game is played the array _steps_made is filled with more and more GameShifts, and the _final matrix is updated.<br><br>
 * 
 * _current_step is intended to keep track of the step that the user is at when replaying the game. Normally the user
 * is just playing the game, so the _current_step points to last move made.<br><br>
 * 
 * When playing in EXPLORER mode the _solution member is empty (the array is being generated). In the SOLVER mode it is
 * kept unchanged and used to generate the final matrix from the initial one (by application of the _solution GameShifts
 * to the _start matrix). The _solution array can also be used to demonstrate (by a replay) to the user how the game
 * can be solved (or to compare the player's solution in terms of the number of steps he/she used)<br><br>
 *  
 * 2) Oscar's Square can be played in two modes, the EXPLORER mode & SOLVER mode<br><br>
 * 
 * 3). In the EXPLORER mode one starts from what normally is a canonical, destination grid D, and tries to perform shifts & rotations
 *  to arrive at an interesting color pattern P. At that point the intention is for the particular player (game designer) to press the 
 *  "Save" button, in order preserve the sequence of shifts which produced the final pattern. When the "Save" button is pressed 
 *  the game is saved, however, in the SOLVER mode. That is, the final grid P is considered to be the starting point of a new SOLVER game,
 *  and the initial, canonical, grid I is the target of a player's session. The sequence of moves from I to P obtained in the EXPLORER
 *  mode is reversed and saved, and treated as a solution for the SOLVER mode game.<br><br>
 */

	
// *************** CONSTRUCTORS ****************************

/**
 * This constructor takes as argument simply the size of the game's matrix and creates the simplest version of it.
 * That is, the square will be divided into 4 sub-squares. All other field members are defaulted to the most reasonable
 * values.<br><br>
 * 
 * @param n   (size of the underlying matrix; everything else is defaulted)
 */


const Mode_EXPLORER = 0;
const Mode_SOLVER   = 1;
const _name_root    = "TorusGame";

var Game = function (n, m, mode){ //n can be a number or a matrix M,
                                  // m - a number of an array of game shifts
                                  // mode may not be present, might be a number or array of shifts

    if (typeof n == 'number'){
	var M = OscarsSquare.createInitialBoard(n, m);  // static method
	this.initialize(_name_root, Mode_SOLVER, M, new Array(), new Array(), M);
    } else {
	//	var msg = "Game(_, _): the first and second parameters must be numbers or arrays (matrices).";
        var msg = "Game(_, _): the first and second parameters must be numbers.";
	throw msg;
    }
}

    
/**

///////////////////////////// INTERVENTION 12/30/2017 ////////////////////////
//////////// Looks like we do not need all those modes of initialization, for simple web implementation. //////
/// In fact, I nitialized the game in EXPLORER mode -- completely un-intended -- //////////////////////////////

    if (typeof n == 'number'){
	var M = OscarsSquare.createInitialBoard(n, m);  // static method
	this.initialize(_name_root, Mode_EXPLORER, M, new Array(), new Array(), M);
    } else if (Array.isArray(n) == true && typeof m == 'number'){
	this.initialize(_name_root, Mode_EXPLORER, M, new Array(), new Array(), M);
    } else if (Array.isArray(n) == true && typeof m == 'array' && typeof mode == 'number'  ){


	
 
// In addition to the setting of the data members to the given values, this construction method
// applies the given shifts to the internal oS object. In the SOLVER mode, the given shifts are 
// interpreted as the solution shifts and the end game matrix (_final) is calculated (the _oS is then reset).
// This is because the internal state holder _oS is first used to calculate the destination matrix (which then
// becomes completely static and used to detect whether the player has reached the end of the game), and then reset
// to keep track of the player's moves.<br>
// In the EXPLORER mode the shifts are interpreted as the player's moves that the game just being
// created may extend.<br><br>
// 
// 
// @param M         (the game's underlying initial matrix)
// @param shifts    (a sequence of shifts to be applied to the given matrix)
// @param mode      (the mode of the game; either EXPLORER of SOLVER


    

    var M = n; // Reinterpretting due to limitations of javascript
    var shifts = m; // That's how we interpret m in this case
	
    if (mode == Mode_EXPLORER){
	this.initialize(_name_root, mode, M,  shifts, new Array(), M);
       } else if (mode == Mode_SOLVER) {
	 this.initialize(_name_root, mode, M, new Array(), shifts, M);
       } else {
	  var msg = "Game(Matrix, Array<GameShift>, Mode): Unknown game mode given.";
	  throw msg;
       }
	
    var subSquareDim = OscarsSquare.determineSubsquareDim(M);
    var oS = new OscarsSquare(M, subSquareDim);
 	
    if (shifts.length != 0) {
	if (mode == Mode_EXPLORER){
	    oS = this.replayFromStart(shifts.length, false); // Replaying the player's moves means that
	                                              // _start has been modified
            this._start = copyArray(M);
	   } else if (mode == Mode_SOLVER) {
	    oS = this.replayFromStart(shifts.length, true);  // We're replaying the solution here	
	    // the _start and _oS object has been modified as a result of the above call.
	    // Restoring ... 
	    this._start = copyArray(M);
            var F= oS.getM();
	    this._final = copyArray(F);
	    // We need to reset the internal _oS to the starting point -- the solving game has not been played yet
	    this._oS = new OscarsSquare(copyArray(M), subSquareDim);
	   } else {
            var msg = "Game(Matrix, Array<GameShift>, Mode): Unknown game mode given when replaying a game's moves.";
	    throw msg;
           }
       }

    } else if (typeof n == 'array' && typeof m == 'array' && typeof mode == 'array'  ){


  
//  In addition to the setting of the data members to the given arguments, this constructor
//  brings up to date the _oS (which holds the current matrix -- i.e. the matrix the player has gotten to -- or the current state), and 
//  the _final - the matrix which holds the end game state. Since the solution shifts are given,
//  this constructor is meant to be run in SOLVER mode. Namely, the constructor "resurects" a formerly played game in SOLVER mode.<br><br>
//  
//  @param M            (the initial matrix _start )
//  @param attempt      (the sequence of player's moves, not neccessarily leading to a solution)
//  @param solution     (a solution sequence which when applied to _start results in the destination matrix)
// 
//
        var M       = n;         // Reinterpretting due to limitations of javascript
	var attempt = m;         // Reinterpretting due to limitations of javascript
	var solution = mode;     // Reinterpretting ...
	
	this.initialize(_name_root, Mode_SOLVER, M, attempt, solution, M);
	// Check whether the solution is not empty
	var subSquareDim = OscarsSquare.determineSubsquareDim(M);
	var oS = new OscarsSquare(M, subSquareDim); // We really need M only for size here; not for its content
	if (solution.length != 0) {
		// The below call temporarily changes the _start matrix
		// and the _oS object.
		// We restore _start matrix  and the _oS in the lines that follow.
		// Hence are using the services of the Game object to 
		// calculate the game ending matrix.
	    oS = this.replayFromStart(solution.length, true);
	    this._start = copyArray(M);
	    this._oS = new OscarsSquare(copyArray(M), subSquareDim );
	}
	
	var F = oS.getM();
	this._final   = copyArray(F); // In "SOLVER" mode one needs this matrix to check whether the game is not finished	
    } else {
	//	var msg = "Game(_, _): the first and second parameters must be numbers or arrays (matrices).";
        var msg = "Game(_, _): the first and second parameters must be numbers.";
	throw msg;
    }
}

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////// END OF INTERVENTION 12/30/2017 ////////////////////////
///////////////////////////////////////////////////////////////////////////////////
	
**/
	
	// ******************** UTILITIES *****************************
	
	/**
	 * Utility function which sets the internal fields of the Game object to the given values.<br><br>
	 * 
	 * 
	 * 
	 * @param name         (the root of the game's name -- to be used when saving and retrieving the game)
	 * @param mode         (the mode the game is to be played in -- either EXPLORER or SOLVER)
	 * @param M            (the initial matrix _start -- i.e. the start of the game )
	 * @param attempt      (this is a sequence of the players moves -- i.e. their "attempt" at solving the puzzle)
	 * @param solution     (the sequence of moves which results in the destination matrix)
	 * @param F            (the destination matrix -- which is intended to be first calculated using the services of the OscarsSquare class.
	 */


Game.prototype.initialize = function(name,     // string
				     mode,     // string
				     M,        // matrix (i.e. array representing the game)
			             attempt,  // array of GameShifts of a player attempt, 
			             solution, // array of GameShifts of a solution 
			             F){      // matrix (i.e. array representing the final matrix in the game)
    this._name         = name;
    this._mode         = mode;
    this._start        = copyArray(M);
    this._subSquareDim   = OscarsSquare.determineSubsquareDim(M);
    this._oS           = new OscarsSquare(M, subSquareDim);
		
    this._current_step = 0;
    this._steps_made   = attempt.slice(0);	// Shallow copy -- fingers crossed
    this._solution     = solution.slice(0); // Shallow copy
    this._final        = copyArray(F);        // Deep copy
    this._listeners    = new Array(); // Array of listener objects -- we may skipp this.
    this._game_over    = false;


    // Now let's put in the support for the mouse event sensitivity
    
    // Last touch event
    this._downX = null;
    this._downY = null;

    // Constants
    this.MIN_SWIPE_H = 30;
    this.MIN_SWIPE_V = 30;

    this.TAN_45  =  1;
    this.TAN_135 = -1;
    this.TAN_225 =  1;
    this.TAN_315 = -1;

    this.DIAG_EPSILON = 0.7;  // Tangent of the angular tolerance when making diagonal swipes
    
    this._notouch_mode_on = false;

    this.SwipeType = {

	NONE  : "none",
	SOUTH : "south",
	NORTH : "north",
	WEST  : "west",
	EAST  : "east",
	NORTH_EAST : "north_east",
	SOUTH_EAST : "south_east",
	SOUTH_WEST : "south_west",
	NORTH_WEST : "north_west"
    };

    this.gWidth  = 620;  // 640
    this.gHeight = 620;
  
}

Game.prototype.setNoTouchMode = function(){
    this._notouch_mode_on = true;
}

Game.prototype.unsetNoTouchMode = function(){
   this._notouch_mode_on = false;
}

Game.prototype.isOver = function(){
    return this._game_over;
}

Game.prototype.getName = function(){
    return this._name;
}

Game.prototype.setName = function(name){
    this._name = name;
}

Game.prototype.setSolution = function(solution){ // Solution is an array of the GameShifts
    this._solution = solution.slice(0); // Could be shallow copy
    return this._solution.length;
}
	
/**
 * This function sets the Game object's _solution field to the given sequence of GameShifts.
 * It then generates the result of application of those shifts
 * to the _start matrix. The function does not set the internal _final matrix
 * however.
 * 
 * @param solution (a GameShift array)
 * @return the matrix obtained by application of the solutions shifts to the initial matrix _start
 */
// This function returns the final matrix; it sets the Game objects 
	
Game.prototype.setSolutionWithFinal = function(solution){ // solution is an array of the GameShifts
    this._solution = solution.slice(0); // Could be shallow copy
    var oS = this.replayFromStart(solution.length, true); // "true" means we're replaying the solution's shifts
    var M = copyArray(oS.getM());
    return M;
}	

Game.prototype.getMode = function(){
	return this._mode;
}

Game.prototype.setMode = function(mode){
    var temp = this._mode;
    this._mode = mode;
    return temp;
}
	
/**
 * As indicated above, the game object is intended to provide game replaying capability. Hence we
 * need to be able to go back to the step previously made. This function sets the "focus pointer"
 * (simply the index of the move in question) to the provided argument.<br>
 * 
 * @param s (the number, "cursor", pointing to the move a player has made in the course of the game)
 * @return   the number of steps the player has made after the move pointed to
 */
// The below function simply changes the pointer to 
// a "step" or "move" that was made in the past
// How about retrieving the state of the game after that move?

Game.prototype.setCurrentStep = function(s){ // s is an integer -- state of the game *after* step s (beginning of a game is step 0)
		var ss = this._steps_made.length;
		if (s > ss){ 
		    var msg = "Game.setCurrentStep: Trying to set a game's current step beyond those that have been made.";
		    throw msg;
		}
    
		this._current_step=s;
		return (ss - s); // How many steps more have been made
	}
	
Game.prototype.getCurrentStep = function(){
    return this._current_step;	
}

/**
* The state of a game is held in the OscarsSquare object. This function simply returns the reference to that internal object.
* OscarsSquare contains the matrix that has been reached in the course of the game.<br><br>
* 
* @return Returns the internal OscarsSquare objects which holds the current state of the game
*/
	
Game.prototype.getState = function(){
    return this._oS;
}

Game.prototype.getSquareRef = function(){ // Same function but clearer name
    return this._oS;
}
	
/**
* On occasion we might need to get the starting matrix. For example, the entries of the matrix
* serve as color codes with which to display the cells. Knowing the original coloring is helpful and
* we need to make that information quickly available (by returning a reference) to other parts
* of the code.
* 
* @return A reference to the original matrix is returned.
*/

Game.prototype.getStart = function(){
    return this._start;
}
	
Game.prototype.setStart = function(M){ // M is an array
    // We're going to make sure that our Game object owns the matrix
    this._start = copyArray(M);
}
	
/**
*  Real-time GUI listeners may be interested in knowing how far the player is from the solution ....
*  Other uses could arise.
* 
* @return A reference to the matrix which closes the game.
*/
	
Game.prototype.getFinal =  function(){
    return this._final;
}
	
Game.prototype.setFinal = function (M){ // M is an array (a matrix)
 // We're going to make sure that our Game object owns the matrix
    this._final = copyArray(M);
}
	
/**
* 
*  This array may be needed to extract some special information about the player's game (GUI listeners may be interested in it
*  to display some simple real-time analysis). Let's expose all the player's moves by reference.
* 
* 
*/


Game.prototype.getPlayerMoves = function(){
    return this._steps_made;  // Array of the player's moves	
}
	
Game.prototype.setPlayersMoves = function(pMoves){ // pMoves is an array of the player's moves
 // We're going to make sure that our game object owns the list
    var tmp = new Array();
    this._steps_made =tmp.concat(pMoves); // concat creates new array
}

/**
* 
*  To extract some special information about the game's solution (GUI listeners may need that for
*  some kind of a real-time analysis if I ever implement it). Let's expose all moves in the provided solution.
*  
* 
*/
	
Game.prototype.getSolutionMoves = function(){
    return this._solution;	
}
	
Game.prototype.setSolutionMoves = function(sMoves){ // sMoves is an array of GameShifts
    // We're going to make sure that our game object owns the list
    var tmp = new Array();
    this._solution = tmp.concat(sMoves); // concat(.) creates new array
}

	
/**
*  Given an initial matrix there are two ways to generate game paths:<br>
*   1) following the players moves,<br>
*   2) following the actual solution's moves.<br>
*   In the below function the Boolean variable fromSol "decides" which of those paths will be followed
* 
* @param s   (the number of steps  to replay)
* @param fromSol   (a boolean flag directing to apply solution's moves (true) or the players moves (false)
* 
* @return   The internal OscarsSquare object holding the state of the game after application of the suitable sequence of shifts
*/

Game.prototype.replayFromStart = function(s, fromSol){ // s is an int, fromSol -- a Boolean
		
    var shifts = new Array();
    if (fromSol){
	shifts = this._solution;
	} else {
	shifts = this._steps_made;
	}
		
    this._current_step = s; // This is the only sensible value to set the _current_step to.
		
    var ss = shifts.length;
    if (s > ss){
	msg = "Game.replayFromStart: Trying to replay past the end of the game.";
	throw msg;
       }
		
    subSquareDim = OscarsSquare.determineSubsquareDim(this._start);
    this._oS = new OscarsSquare(copyArray(this._start), subSquareDim); // Resetting the game for a nanosecond
     for (var i=1; i<=s;i++){
	  this._oS.shiftG(shifts[i-1]);
	  }
		
     return this._oS;
}
	
/**
 * This method removes the last move fromt the list of moves made by the player, updates the
 * internal state (the _oS) object, and returns the length of the new player's shift list. <br><br>
 * 
 * @return The number of moves the player has made, excluding the deleted one.
 *
 * NOTE: Not used in the "live" code as of 12/30/2017; instead the applyShift(forward/backward) are
 * used on "Undo", "Redo" button clicks. This function physically removes the last move from the
 * list of players' moves -- that's a (completely) diffierent behavior from that of applyShift
 * which preserve the player's list.
 */

Game.prototype.undoLastMove = function(){  // Returns the length of list calling player's moves
    var m = this._steps_made.length;
		
    if (m == 0) {
	return 0;
    }

    var gs = this._steps_made[m-1];
    var sg = gs.invert();
    this.applyShift(sg);  // Increases size of _steps_made to m+1
    this._steps_made.pop(); // Removing the last element
    this._steps_made.pop() // Removing the last element again
    this.setCurrentStep(m-1);

    if (this._game_over == true){
        this._game_over == false;
	this._notouch_mode_on = false; // Will enable enqueing new moves
    }
    
    return m-1;
}
	
/**
 * 
 * A utility method. The moves contained in the list passed in are reversed
 * (i.e. their order is reversed and each of the moves is inverted) , and the reversed list is returned without modifying any
 * internal state variable.
 * 
 * @param A list of games shifts to be reversed.
 * @return A reversed (and inverted) list is returned.
 * 
 */

Game.prototype.reverseMoves = function(original){ // list of game shifts to be reversed
    var reversed = new Array();
    var m = original.length;
    for (var i = 0; i < m; i++){
	 var rs = original[m-1-i].invert();  // This looks like inversion in place
	 reversed.push(rs);
		   }
    return reversed;
}
	
// JAVA SCRIPT: the below function imitates overloading of the applyShift function. The two versions -- now in the body of
// one function are described below as they were implemented in Java

/**
 * In general, the basic idea is to apply the shift or a rotation contained in the GameShift object. What "apply"
 *  means depends on the state of the player's "console". If the player simply plays the game (as opposed to replaying it)
 *  the game's _steps_made array is augmented by the given shift and the internal OscarsSquare object is updated. Whether
 *  the game is being replayed is detected by looking at the _current_step -- in the normal play mode it points to the 
 *  last step made.<br><br>
 *  
 *  Hence in the EXPLORER mode, the the _steps_made is augmented and _oS (internal OscarsSquare updated). In the SOLVER mode,
 *  an additional check is made whether the player reached the end of the game (by comparison with the _final matrix) <br><br>
 *  
 *  In the replay mode, this subroutine does not make any updates to any of the internal fields. It simply returns -1 in order
 *  to signal to the caller that insertion of the new GameShift object would alter history and anything after that insertion
 *  would be clipped. If the caller after seeting the -1 return wants to proceed with insertion while in the replay mode, then
 *  they will need to use an overloaded version of this method int applyShiftG(GameShift gs, boolean force_history_clipping).<br><br>
 *  
 * @param gs  (the GameShift object containing all the information about the player's move)
 * @return    The current step (a number) in the player's game
 */

	
/**
 * This method is an overloaded version of in applyShift(GameShift gs) which allows for the clipping of the history of the players moves
 * if they try to make a (new) move in the middle of a replay.<br><br>
 * 
 * @param gs  GameShift containing all the information about the player's move
 * @param force_history_clipping  This boolean flag indicates whether in replay mode the history after the given mode should be clipped
 * @return   Simply, the index + 1 of the move (GameShift) the Game object is currently looking at. If not in the replay mode, the returned
 *  value is equal to the number of moves the player has made.
 */

Game.prototype.applyShift = function(gs, force_history_clipping){ // gs is a GameShift, force_history_clipping is a bollean
    if (typeof force_history_clipping === "undefined"){
	var ss = this._steps_made.length;
	if (this._current_step < ss){
	    // Here the user is in the midst of replaying the his moves and wants to proceed
	    // with a new step; he forfeits all the steps from that point onwards; as a 
	    // warning returning -1
	    return -1;
	}

	console.log("We're inside applyShift");
		
	if (this._mode == Mode_EXPLORER){
	    this._oS.shiftG(gs);
	    this._current_step +=1;
	    // Am I copying this obect correctly?
	    var ggs = new GameShift(gs.dim);
	    ggs.setShift(gs.mask);
	    this._steps_made.push(ggs);
	    // Update the final Matrix
	    this._final = copyArray(this._oS.getM());
	} else {		
	    if (this._final == this._oS.getM()){
		console.log("Game.applyShift: Cannot proceed, the solution has already been reached.");
		return -3; // Do not proceed past the end of the game
	    }
			
	    this._oS.shiftG(gs);
	    this._current_step +=1;
	    this._steps_made.push(gs.cloneMe());
				
	    if (this._final == this._oS.getM()){
		console.log("Game.applyShift: Congratulations! You have solved the puzzle.");
		return -(this._current_step); // Game over!
	       }			
	}
    
        return (this._current_step);
    } else { // the force_history_clipping is defined (JavaScript version)

	var ss = this._steps_made.length;
	if (this._current_step < ss && force_history_clipping){
	    this._steps_made.splice(this._current_step, ss); // We are assuming here that oS is always sync-ed to _current_step
	   }
		
		// Now that you have clipped history, you should be able to perform apply shift as you did before	
	return this.applyShift(gs);
    }
}	

/**
 * This method clips the game's history at the given step. It adjust the internal counter to the end of the list.
 * Recall that the meaning of _current_step is: "_current_step" moves have been performed.
 * 
 * @param n  The number of steps we want to retain
 * @return   The size of the previous history
 */
	

Game.prototype.clipHistoryAfterAndAdjustCounter = function(n){ // n is an integer
    var ss = this._steps_made.length;
    if (n >= ss || n < 0){
	var msg = "Game.clipHistoryAfterAndAdjustCounter: Internal error: trying to clip game history past the history's range.";
	throw msg;
        }
		
    this._steps_made.splice(n, ss); // removing elements starting from index n --- we're 0 based
    this._current_step = n;
    return ss; // Returning the old size just in case.
 }
	

Game.prototype.goBackTo = function(step){ // step is an int
    this.setCurrentStep(step); // This returns the number of steps left in the game (past the step argument)
    return (this.replayFromStart(step));
}
	

Game.prototype.goBackNumSteps = function(num_steps){ // num_steps is an int
    var ss = this._steps_made.size();
    this.setCurrentStep(ss - num_steps); // Will throw exception if num_steps is too large
    return (this.replayFromStart(this._current_step));
}
		
	
Game.prototype.replayShift = function(forward){ // forward is meant to be Boolean


   // The difference between this function and the applayShift(s) is that
    // this one won't do anything at the end of history and 
    // never modifies the history -- it only replays
    if (forward == true){    
	var ss = this._steps_made.length;
	if (this._current_step == ss){
	    return -1;  // You're at the end -- nothing to replay
	}
		
	this._current_step += 1;
	this._oS.shiftG(this._steps_made[this._current_step - 1]); // We keep _oS synchronized with the _current_step
	return this._current_step;
    } else {
  /**
   * This overload allows a single function which moves the replay forward or backward depending on the Boolean flag
   *  forward. 
   *  	
   * @param back A Boolean flag which states whether we're playing backward
   * @return The replay counter after the operation (when not replaying that counter is always equal to the numbers of moves made in the game overall).
   */
	   
	if (this._current_step == 0){
	    return -1;  // You're at the beginning of the replay  -- can't go back any further
	   }

        var gs = this._steps_made[this._current_step - 1]; // Remember the index is 1 less than the _current_step !!!!
	this._current_step -= 1;
	var inv = gs.invert();
	this._oS.shiftG(inv); // We keep _oS synchronized with the _current_step
	return this._current_step;

    }
}
	
Game.prototype.replaySolutionShift = function (forward){

    if (typeof forward === "undefined" ){
    // The difference between this function and the applayShift() is that
    // is that a shift in the _solution list is found and applied to the 
    // internal OscarsSquare object (not in the _steps_made -- which contains
    // the player's moves).
	var ss = this._solution.length;
	if (this._current_step == ss){
	    return -1;  // You're at the end -- nothing to replay
	}

	this._current_step += 1;
	this._oS.shift(this._solution.get(this._current_step - 1)); // We keep _oS (OscarsSquare) synchronized with the _current_step
	return this._current_step;
    } else {

	if (forward == true){
	    return this.replaySolutionShift();
	   }
		   
	if (this._current_step == 0){
	    return -1;  // You're at the beginning of the replay  -- can't go back any further
	   }

	var gs = this._solution.get(this._current_step - 1); // Remember the index is 1 less than the _current_step !!!!
	this._current_step -= 1;
	var inv = gs.invert();
	this._oS.shift(inv); // We keep _oS synchronized with the _current_step
	return this._current_step;
    }
}
	

	

Game.prototype.reset = function(){

    var subSquareDim = OscarsSquare.determineSubsquareDim(this._start);
    this._oS = new OscarsSquare(copyArray(this._start), subSquareDim);
    this._current_step = 0;
    this._steps_made.length = 0;  // Clearing the array to start anew

    if (this._game_over == true){
        this._game_over = false;
	this.unsetNoTouchMode();
         var n = this._oS.getDim();
         var m = subSquareDim;
         var size_str = n + " x " + m;
	 var imgSrc = DifficultyIndicator.IconMap.get(size_str);
	 var imgDOM = document.getElementById("difficulty_image");
	 imgDOM.src = imgSrc;
//	 imgDOM.show();
    }
}

/**
 * 
 * This function is the most general version of the replayShift methods. It allows to play a move with
 * index _current_step forward or backward depending on the Boolean flag "forward". The move is found
 * in the list of all moves and then applied to the internal OscarsSquare object. Which of the lists
 * is used to find the shift is governed by the myMoves flag. If myMoves = 1, the shift is taken from
 * the _steps_made list. If myMoves = 0, the shift is taken from the _solution list.<br><br>
 * 
 * @param forward  Boolean flag directing to move forward or backward along the list of moves indicated by the second argument
 * @param myMoves  Boolean flag indicating whether the move is taken from the player move list or the solution list.
 * @return  The value of the internal move counter _current_step after the shift has been replayed.
 */

Game.prototype.replayShiftW = function(forward, myMoves){ // forward & myMoves is boolean
    var ret = -1;
    if (myMoves == true){
	ret = replayShift(forward);
    } else {
	ret = replaySolutionShift(forward); 
    }

    return ret;
}

/*
	private void printMatrix(Matrix M, String fileName, Boolean append, String desc){
		   PrintWriter writer = null;
		    try {
		         writer = new PrintWriter(new OutputStreamWriter(new FileOutputStream( new File(fileName), append), _charset));
		    } catch (FileNotFoundException | UnsupportedEncodingException e) {
		        // TODO Auto-generated catch block
		        e.printStackTrace();
		        String msg = "Game.printMatrix: File not found or unsupported encoding passed to \"printMatrix(...)\".";
		        throw new RuntimeException(msg);
		    }
		    
		    writer.println();
		    writer.println(Character.toString(_matrix_idr.charAt(1)) + " " + desc);
		    M.print(writer, 1, 0);
		    writer.flush();
		    writer.close();
	}
*/

	// At this point this is only a function
	// in which I try saving files in java;
	// not intended to be a final method in this class

/*
	public void saveState(String fileName){
		

	   
	    printMatrix(_oS.getM(), fileName, true, _state_descr);
	}
	
	// As of this writing the below function is a just 
	// a test function
	
	private void saveState(OscarsSquare sQ, String fileName){
		    printMatrix(sQ.getM(), fileName, true, _state_descr);
	}
	
	
	
	// Also a test function for now
	private void saveState(OscarsSquare sQ, Boolean append){
		    NameGenerator nG = new NameGenerator(_name + "_", ".dbg");
		    String fileName = nG.newName();
		    printMatrix(sQ.getM(), fileName, append, _state_descr );
	}
	
	private void saveName(String fileName){
		saveString(fileName, _name_idr, _name_descr, _name, false); // "false" because name starts the file
	}
	
	private void saveMode(String fileName){
		if (_mode == Mode.EXPLORER){
		    saveString(fileName, _mode_idr, _mode_descr, EXPL_STRING, true); // "true" because we're appending the string to an existing file
		} else {
			saveString(fileName, _mode_idr, _mode_descr, SLV_STRING, true);
		}
    }
	
	private void saveString(String fileName, String first, String descr, String value, Boolean append){
		
		   // First we're going to simply print the starting matrix:
		   PrintWriter writer = null;
		    try {
		    	// "false" below means that we are overwriting the file
		         writer = new PrintWriter(new OutputStreamWriter(new FileOutputStream( new File(fileName), append), _charset));
		    } catch (FileNotFoundException | UnsupportedEncodingException e) {
		    	e.printStackTrace();
		        String msg = "Game.saveString: File not found or unsupported encoding passed to \"saveGame(...)\".";
		        throw new RuntimeException(msg);
		    }
		
		    String idr = Character.toString(first.charAt(1));
		    idr = idr + " " + descr; // Creating an indicator line that what follows is a particular string
		    writer.write(idr, 0, idr.length());
		    writer.println();
	        writer.write(value, 0, value.length());
	        writer.println();
	        writer.close();
	}
	
	private void saveMoves(String filename){
		    saveMoves(filename, Character.toString(_attmpt_idr.charAt(1)),  _steps_made, _pmvs_descr, false);
	}
	
	private void saveSolution(String filename){
		   saveMoves(filename, Character.toString(_soltn_idr.charAt(1)),  _solution, _smvs_descr, false);
	}
	
	private void saveMoves(String fileName, String first, ArrayList<GameShift> shifts, String descr, Boolean human_readable){
		   Path file = 	Paths.get(fileName);
		   Charset charset = Charset.forName(_charset);
		   try (BufferedWriter writer = Files.newBufferedWriter(file, charset, APPEND)) {
			   writer.newLine();
			   first = first + " " + descr;
		       writer.write(first,0,first.length());
		       writer.newLine();	
			   for (int j=0; j<=shifts.size()-1; j++){
				     if (human_readable == true){
				         String move = shifts.get(j).toText();
			             writer.write(move, 0, move.length());
			             writer.newLine();
			            } else {
					     int move = shifts.get(j).getShift();
					     String mS = String.valueOf(move);
					     mS += ",";
				         writer.write(mS, 0, mS.length());		   
	                    }
			       }   
		   } catch (IOException x) {
		       System.err.format("IOException: %s%n", x);
		   }			
	}
	
	public void saveGame(){
		 NameGenerator nG = new NameGenerator(_name + "_", _file_ext);
		 String fileName = nG.newName();
		 saveGame(fileName, _mode);
	}
	
	public void saveGame(String fileName, Mode mode){
		
		 this.saveName(fileName);
		 this.saveMode(fileName);
		 this.printMatrix(_start,  fileName, true, _im_descr);
		 this.saveMoves(fileName);
		 if (mode == Mode.SOLVER) {
		     this.saveSolution(fileName);
		    }
		 
		 if ( (mode != Mode.SOLVER) && (mode != Mode.EXPLORER)){
			  String msg = "Game.saveGame: Saving in unknown game mode.";
			  throw new RuntimeException(msg);
		 }
	//	 this.saveState(fileName);
	//	 this.printMatrix(_final, fileName, true, _fm_descr); // True means we are appending  the final matrix to the end;
	}
	
	
	public void saveGameAndSwitchMode(){
		 NameGenerator nG = new NameGenerator(_name + "_", _file_ext);
		 String fileName = nG.newName();
		 saveGameAndSwitchMode(fileName, Mode.EXPLORER);
	}
	
	// This function SHOULD BE ONLY USED if the game is in EXPLORER mode; it will save 
	// the game in the SOLVER mode
	public void saveGameAndSwitchMode(String fileName, Mode mode){
	    if (mode != Mode.EXPLORER){
	    	String msg = "Game.saveGameAndSwitchModes: Saving and switching the mode can only be done in the EXPLORER mode.";
	    	throw new RuntimeException(msg);
	       }
	    
	    this.saveName(fileName);
	    
	    // Below I have to use the internal function instead of simply
	    // this.saveMode(fileName)
	    // as I would not like to change the mode
	    // of the whole game object just yet; that should be a responsibility of 
	    // the GameManager (which is as of 06/09/2016 not written yet)
	    saveString(fileName, _mode_idr, _mode_descr, SLV_STRING, true); // "true" means we're appending (not overwriting)
	    
	    // Since we have been working in EXPLORER mode, the final matrix is the starting matrix of the new
	    // game we have created
	    
		this.printMatrix(_final,  fileName, true, _im_descr);
		// We do not save the players moves when in EXPLOER mode; those moves
		// are saved in the reverse direction as the solution
		// this.saveMoves(fileName);
		ArrayList<GameShift> reversed = this.reverseMoves(_steps_made);
		this.saveMoves(fileName, Character.toString(_soltn_idr.charAt(1)), reversed, _smvs_descr, false );
	}
*/	
	/**
	 * This function is helpful when while solving a game one reached an interesting color pattern and wants to 
	 * make it the starting point of the game. The method does not modify itself (this). Instead it creates
	 * a suitable new Game object and saves it to a file. After the function returns, the new object is forgotten
	 * and the this object persists in its old state.
	 * 
	 * @param filename
	 */
/*	
	public void saveCreatingNewGame(String fileName) {  // The mode is assumed to Mode.Solver
		if (this._mode != Mode.SOLVER){
	    	String msg = "Game.saveCreatingNewGame: The game needs to be in \"SOLVER\" mode in order to save creating a new game.";
	    	throw new RuntimeException(msg);				
		   }
		
	    int nn = _oS.getSize();
	    int mm = _oS.getSubSquareDim();
	    Game newGame = new Game(nn, mm, this.getName()); // This object will have the same name but will disappear from
	                                                     // memory after this function returns without altering the 
	                                                     // the object which spawns it.
	    newGame.setMode(Mode.SOLVER);
	    
		Matrix newOriginal = this.getState().getM(); // The final matrix should not change, so we'll leave it alone.
		newGame.setStart(newOriginal);
		newGame.setFinal(this.getFinal());
		// Let's create new solution sequence
		ArrayList<GameShift> newSolution = new ArrayList<GameShift>();
		ArrayList<GameShift> reversed = this.reverseMoves(_steps_made);
		newSolution.addAll(reversed);
		newSolution.addAll(_solution);
		newGame.setSolutionMoves(newSolution);
		newGame.saveGame(fileName, Mode.SOLVER);
	}
	
	private static Matrix readMatrix(String fileName){
    	// TODO; is the below code robust? Can JAMA change the read function?
	    // JAMA says that read works only in the US locale ...
		 Matrix M = new Matrix(0,0); // Dummy matrix
		 
		 try {
		      FileReader fR = new FileReader(fileName);
	          BufferedReader bR = new BufferedReader(fR);
		 
		      String line;
		      Pattern p = Pattern.compile(_matrix_idr);
		      while ((line = bR.readLine()) != null){
		     	      Matcher m = p.matcher(line);
		     	      if (m.find()){
	    	    		 M = Matrix.read(bR);
	    	    		 bR.close();
	    	    		 fR.close();
	    	    		 break;
		     	        }
		             }
		      bR.close();
		      fR.close();
	        } catch (FileNotFoundException e){
	    		String msg = "Game.readMatrix: File " + fileName + " not found.";
	    		throw new RuntimeException(msg);
	    	} catch (IOException e){
	    	    String msg = "Game.readMatrix: Unable to read an existing file " + fileName + ".";
			    throw new RuntimeException(msg);
	        }
		 
	     return M;
	}
	
	private static String readName(String fileName){
		return readString(fileName, _name_idr);
	}
	
	private static Mode readMode(String fileName){
		String mode =  readString(fileName, _mode_idr);
		if (mode.equals(EXPL_STRING))
		   {
			return Mode.EXPLORER;
		   } else {
			 return Mode.SOLVER;
		   }
	}
	
	private static String readString(String fileName, String idr){
		
		 String str = new String();
		
		 try {
		      FileReader fR = new FileReader(fileName);
	          BufferedReader bR = new BufferedReader(fR);
		 
		      String line;
		      Pattern p = Pattern.compile(idr);
		      while ((line = bR.readLine()) != null){
		     	      Matcher m = p.matcher(line);
		     	      if (m.find()){
		     	    	 if ((line = bR.readLine()) != null){
	    	    		     str = line;
		     	            }
		     	   	     bR.close();
	     	    	     fR.close();
	    	    		 break;
		     	        }
		             }
		      bR.close();
		      fR.close();
	        } catch (FileNotFoundException e){
	    		String msg = "Game.readMatrix: File " + fileName + " not found.";
	    		throw new RuntimeException(msg);
	    	} catch (IOException e){
	    	    String msg = "Game.readMatrix: Unable to read an existing file " + fileName + ".";
			    throw new RuntimeException(msg);
	        }
		 
	     return str;	
	}
	
	private static ArrayList<GameShift> readAttempt(String fileName, int dimension){
		return  readShifts(fileName, _attmpt_idr, dimension);
	}
	
	private static ArrayList<GameShift> readSolution(String fileName, int dimension){
		return  readShifts(fileName,_soltn_idr , dimension);
	}	
	
	private static ArrayList<GameShift> readShifts(String fileName, String startPattern, int dimension) {
 		 ArrayList<GameShift> shifts = new ArrayList<GameShift>(); 
		 try {
		      FileReader fR = new FileReader(fileName);
              BufferedReader bR = new BufferedReader(fR);

		      Pattern p = Pattern.compile(startPattern);
			  String line;
		      while ((line = bR.readLine()) != null){
		     	      Matcher m = p.matcher(line);
		     	      if (m.find()){
		     	    	 if ((line = bR.readLine()) != null) { // the shifts are listed in the next line
	    	    		      String[] mvs = line.split(",");
	    	    		      if (mvs.length != 1 | mvs[0].compareTo("") != 0 ){  // Checking that we did not read in an empty line
	    	    		          for (int q=0; q < mvs.length; q++){
	    	    			           GameShift gs = new GameShift(dimension);
	    	    			           gs.setShift(Integer.parseInt(mvs[q]));
	    	    			           shifts.add(gs);
	    	    		              }
	    	    		         }
		     	    	     }
		     	    	 bR.close();
		     	    	 fR.close();
			     	     break;
		     	        }
		             }
		      bR.close();
		      fR.close();
	        } catch (FileNotFoundException e){
	    		String msg = "Game.readShifts: File " + fileName + " not found.";
	    		throw new RuntimeException(msg);
	    	} catch (IOException e){
	    	    String msg = "Game.readShifts: Unable to read an existing file " + fileName + ".";
			    throw new RuntimeException(msg);
	        }
	     
	     return shifts;
	}
*/
	
	/**
	 * 
	 * This is a (very) thin wrapper around the the static Game readGame(String fileName, Mode GM_mode, Boolean newGame)
	 * function which forces the Boolean flag newGame to be false. Written so that overloading imitates default value
	 * for that argument. When newGame is false, the file that is being read ignores the player's moves which might
	 * be contained in it (it is assumed that the game just starts, so those moves shoudl be discarded).<br><br>
	 * 
	 * 
	 * @param fileName (the file to read the game from)
	 * @param GM_mode  (the mode in which to read and interpret the given saved file)
	 * @return A new game object is returned which can track a brand new game or a continuation of a game.
	 */

/*
	public static Game readGame(String fileName, Mode GM_mode) {
		return readGame(fileName, GM_mode, false);
	}
*/	
	/**
	 * 
	 * This function reads a game from file. The file contains the mode in which the game was saved.
	 * Depending on the mode argument given, the moves contained in the file are interpreted differently, and different
	 * information is expected in the file. The current assumption is that the GameManager (as of 07/05/2016 yet
	 * to be written) has a mode (either EXPLORER or SOLVER and can only load a game saved in the same mode.
	 * The default GameManager mode is EXPLORER.
	 * The last argument is a Boolean indicator whether the game should be continued or started from the beginning
	 *
	 * @param fileName (the file to read the game from)
	 * @param GM_mode  (the mode to read the game in)
	 * @param newGame  (a Boolean flag indicating whether to look for the player's moves in thefile -- false means the game starts anew and any such information is discarded even if present in the file)
	 * @return A new game object is returned which can track a brand new game or a continuation of a game.
	 */
	
	// This function reads a game from file. The file contains the mode in which the game was saved.
	// Depending on the mode argument given, the moves contained in the file are interpreted differently and different
	// things are expected in the file. The current assumption is that GameManager (as of 06/09/2016 yet
	// to be written) has a mode (either EXPLORER or SOLVER and can only load a game saved in the same mode.
	// The default GameManager mode is EXPLORER.
	// The last argument is a Boolean indicator whether the game should be continued or started from the beginning
/*	
	public static Game readGame(String fileName, Mode GM_mode, Boolean newGame) {
		    // Read the game's name
		    String name = readName(fileName);
		    
		    // Read the game's mode
		    Mode mode = readMode(fileName);
		    
		    if (GM_mode != mode ){
		    	String msg = "Game.readGame: Reading a game in mismatched mode.";
		    	throw new RuntimeException(msg);
		       } 

		    // Read the initial matrix
	        Matrix M = new Matrix(0,0);
	    	M = readMatrix(fileName);                // Throws exceptions
	    	int dim = M.getRowDimension();
	    	
	    	    // Read the attempt moves
	        ArrayList<GameShift> att_shifts = new ArrayList<GameShift>();
	        if (newGame == false) {
	            att_shifts = readAttempt(fileName, dim);    // Throws exceptions
	            // By default _current_steps is 0
	        }
	        	
	        	
		    if (mode == Mode.SOLVER){
	    	     // Read the solution moves
	     	     ArrayList<GameShift> sol_shifts = new ArrayList<GameShift>();   	
	    	     sol_shifts = readSolution(fileName, dim);    // Throws exceptions
	    	     Game GG = new Game(M, att_shifts, sol_shifts);
	    	     // If we want to continue we have to set the _current_step (a focus point) properly
		    	 if (newGame == false){
		             GG.setCurrentStep(att_shifts.size()); // _curent_steps  is equal to how many steps have been done.
		    	    }
	 	    	 GG.setName(name);
		    	 GG.setMode(mode);
	    	     return GG;
		       } else if (mode == Mode.EXPLORER){
		    	 ArrayList<GameShift> player_moves = new ArrayList<GameShift>();   	
		    	 player_moves = readAttempt(fileName, dim);    // Throws exceptions
		    	 Game GG = new Game(M, player_moves, mode);
	    	     // If we want to continue we have to set the _current_step (a focus point) properly
		    	 if (newGame == false){
		             GG.setCurrentStep(att_shifts.size()); // _curent_steps  is equal to how many steps have been done.
		    	    }
		 	     GG.setName(name);
			     GG.setMode(mode);	             
	             return GG;
		       } else {  
		    	 String msg = "Game.readGame: Unknown mode read.";
				 throw new RuntimeException(msg);  
		       }
	    }
*/


/* This function scrambles the Game object radomly. */

Game.prototype.scramble = function(scrambleLength ){  
    
 var nn = this._oS.getDim();
 var mm = this._oS.getSubDim();
    
 var allGameShifts = GameShift.generateAllPossibleGameShifts(nn, "main + diags");
    		   /* Let's set up the random choices: */
 var Min = 0; var Max = allGameShifts.length - 1; // The last index
 var randomChoices = new Array();
    
 for (i = 0; i < scrambleLength; i++){
      var rnd =  Min +  Math.floor((Math.random() * ((Max - Min) + 1)));  // Standard idiom for using random in order to 
    		                                                          // generate uniformly distributed integers in the 
    		                                                          // range [Min, Max]
      randomChoices.push(rnd);
     }
 console.log(randomChoices);
    		   
    // NOW CREATING THE NEW GAME OBJECT TO PUT INTO OUT GAME PANEL

 this._oS = new OscarsSquare(nn, mm); // Overriding the underling square object using one of the constructors
// this  = new Game(nn, mm); // Default mode is Mode_EXPLORER
 var preserveInitialForLater = copyArray(this.getState().getM());
 this.setMode(Mode_SOLVER);
  
 // Apply the choices to our game
 for (i = 0; i < randomChoices.length; i++){
      var gs = allGameShifts[randomChoices[i]];
      this.applyShift(gs); 
     }
    		   
 var reversed = this.reverseMoves(this.getPlayerMoves());
 this.setSolutionMoves(reversed);
 this.setCurrentStep(0);
 this.setStart(this.getState().getM());
 this.setFinal(preserveInitialForLater);
 // Reset the game to have no players moves;
 var empty = new Array();
 this.setPlayersMoves(empty);

/*
 var A = game._oS.getM();
 var Atext='';
 for(var i = 0; i < A[i].length; i++) {
     for(var z = 0; z < A.length; z++) {
	 Atext +=  A[z][i] + ' ';
        }
     console.log(Atext);
     Atext = '';
   }  
*/
    return this;  
}

/* This function attaches mouse down event handler to a method in this class.
 * It takes as an argument the a DOM element of a(n html) document. */



Game.prototype.attachMouseDownHandler = function(elem)
{
    var self = this;
    elem.addEventListener("mousedown", function(event) {self.onMouseDown(event);});
    elem = null; //prevents memory leak
}


Game.prototype.attachMouseUpHandler = function(elem)
{
    var self = this;
    elem.addEventListener("mouseup", function(event) {self.onMouseUp(event);});
    elem = null; //prevents memory leak
}

Game.prototype.onMouseDown = function(event){

    if (event.which != 1) {
        return;
    }

    if (this._notouch_mode_on == true ){
         // do nothing
         return;
     }

    var lastX = event.pageX;
    var lastY = event.pageY;
   
    var rect  = event.target.getBoundingClientRect();
    lastX = event.pageX - rect.left; //x position within the element
    lastY = event.pageY - rect.top;

    if (lastX < 0 || lastY < 0 || lastX > this.gWidth || lastY > this.gHeight){
        // Do nothing we did not start in the square
	return;
    }
	 
    this._downX = lastX;
    this._downY = lastY;  
   
    console.log("Which is " + event.which + "\nX = " + this._downX + ", Y = " + this._downY + "\n"); 
}


/* lastX and lastY are assumed to be the coordindates with respect to 
 * the canvas!
 */

 Game.prototype.onSwipeNorth = function(lastX, lastY) {
	 
     if (this._notouch_mode_on == true ){
         // do nothing
         return;
     }
     
     var width  = this.gWidth;
     var height = this.gHeight;

     // Make sure we started the motion inside the square
     if (lastX < 0 || lastY < 0 || lastX > this.gWidth || lastY > this.gHeight){
        // Do nothing we did not start in the square
	return;
     }
     
     var n = this.getState().getDim();
     var field_size_H = width/n;
     // Calculate the column we're in
     var i = Math.floor(lastX/field_size_H);
     console.log("Got column " + i + ".");

     var gs = new GameShift(n);
     var mask = gs.fromCompassRose("N", i);
     gs.setShift(mask);
     this.applyShift(gs, true); //Forcing history clipping if needed
     // this.invalidate(); // <- Android code
     // repaint();         // <- PC code
     var canvas = document.getElementById("theboard");
     this._oS.draw(canvas);
     
     if (this.determineIfOver() == true){
	 this._game_over = true;
         this.setNoTouchMode();
	 var dflty_img_str = DifficultyIndicator.IconMap.get("congrats");
	 var imgDOM = document.getElementById("difficulty_image");
	 imgDOM.src = dflty_img_str; // For some reason redraws automatically
     }
 }

/* lastX and lastY are assumed to be the coordindates with respect to 
 * the canvas!
 */

Game.prototype.onSwipeSouth = function(lastX, lastY) {

	 
     if (this._notouch_mode_on == true ){
         // do nothing
         return;
     }
     
     var width  = this.gWidth;
     var height = this.gHeight;

     // Make sure we started the motion inside the square
     if (lastX < 0 || lastY < 0 || lastX > this.gWidth || lastY > this.gHeight){
        // Do nothing we did not start in the square
	return;
     }

     var n = this.getState().getDim();
     var field_size_H = width/ n;
     // Calculate the column we're in
     var i = Math.floor(lastX/field_size_H);
     console.log( "Got column " + i + ".");

     var gs = new GameShift(n);
     var mask = gs.fromCompassRose("S", i);
     gs.setShift(mask);
     this.applyShift(gs, true); //Forcing history clipping if needed
     // this.invalidate();      // Android code 
     // repaint();              // PC code

     var canvas = document.getElementById("theboard");
     this._oS.draw(canvas)

     if (this.determineIfOver() == true){
	 this._game_over = true;
         this.setNoTouchMode();
	 var dflty_img_str = DifficultyIndicator.IconMap.get("congrats");
	 var imgDOM = document.getElementById("difficulty_image");
	 imgDOM.src = dflty_img_str; // For some reason redraws automatically
     }
 }


 Game.prototype.onSwipeEast = function(lastX, lastY) {
	 
     if (this._notouch_mode_on == true ){
         // do nothing
         return;
     }
     
     var width  = this.gWidth;
     var height = this.gHeight;

     // Make sure we started the motion inside the square
     if (lastX < 0 || lastY < 0 || lastX > this.gWidth || lastY > this.gHeight){
        // Do nothing we did not start in the square
	return;
     }

     var n = this.getState().getDim();
     var field_size_V = height/n;
     // Calculate the row we're in
     var j = Math.floor(lastY/field_size_V);
     console.log("Got row " + j  + ".");

     var gs = new GameShift(n);
     var mask = gs.fromCompassRose("E", j);
     gs.setShift(mask);
     this.applyShift(gs, true); //Forcing history clipping if needed
     // this.invalidate();  // <- Android code
     // repaint();          // <- PC code

     var canvas = document.getElementById("theboard");
     this._oS.draw(canvas);

     if (this.determineIfOver() == true){
	 this._game_over = true;
         this.setNoTouchMode();
	 var dflty_img_str = DifficultyIndicator.IconMap.get("congrats");
	 var imgDOM = document.getElementById("difficulty_image");
	 imgDOM.src = dflty_img_str; // For some reason redraws automatically
     }
 }


 Game.prototype.onSwipeWest = function(lastX, lastY) {
	 
     if (this._notouch_mode_on == true ){
         // do nothing
         return;
     }
     
     var width  = this.gWidth;
     var height = this.gHeight;

     // Make sure we started the motion inside the square
     if (lastX < 0 || lastY < 0 || lastX > this.gWidth || lastY > this.gHeight){
        // Do nothing we did not start in the square
	return;
     }


     var n = this.getState().getDim();
     var field_size_V = height/n;

     // Calculate the row we're in
     var j = Math.floor(lastY/field_size_V);
     console.log("Got row " + j + ".");

     var gs = new GameShift(n);
     var mask = gs.fromCompassRose("W", j);
     gs.setShift(mask);
     this.applyShift(gs, true); //Forcing history clipping if needed
     // this.invalidate();      // <-- Android code
     // repaint();              // PC code

     var canvas = document.getElementById("theboard");
     this._oS.draw(canvas);

     if (this.determineIfOver() == true){
	 this._game_over = true;
         this.setNoTouchMode();
	 var dflty_img_str = DifficultyIndicator.IconMap.get("congrats");
	 var imgDOM = document.getElementById("difficulty_image");
	 imgDOM.src = dflty_img_str; // For some reason redraws automatically
     }
 }

/* NOTE: make sure that in the below function lastX, and lastY are the coordinates 
 * with respect to canvas and not the whole window */
Game.prototype.detectSwipe = function(lastX, lastY){

     var deltaX = lastX - this._downX;
     var deltaY = lastY - this._downY;

     if ((deltaX > this.MIN_SWIPE_H) && (Math.abs(deltaX) > 3 * Math.abs(deltaY))) {
         return this.SwipeType.EAST;
     } else if ((deltaX < -this.MIN_SWIPE_H) && (Math.abs(deltaX) > 3 * Math.abs(deltaY))) {
         return this.SwipeType.WEST;
     } else if ((deltaY > this.MIN_SWIPE_V) && (Math.abs(deltaY) > 3 * Math.abs(deltaX))) {
         return this.SwipeType.SOUTH;
     } else if ((deltaY < -this.MIN_SWIPE_V) && (Math.abs(deltaY) > 3 * Math.abs(deltaX))) {
         return this.SwipeType.NORTH;
     } else {
    	 
     }
     return this.SwipeType.NONE;
}



/*
  * This version of onDialgonalSwipe implements the "flat" diagonal motion as opposed to the
  * true diagonal motion or the radial motion. Note that this function detects whether the swipe
  * was diagonal, and if yes, it applies it. Otherwise, it does nothing.
  */

 Game.prototype.onDiagonalSwipe = function(lastX, lastY) {
	 
     if (this._notouch_mode_on == true ){
         // do nothing
         return;
     }
     
     var width  = this.gWidth;
     var height = this.gHeight;

     // Make sure we started the motion inside the square
     if (lastX < 0 || lastY < 0 || lastX > this.gWidth || lastY > this.gHeight){
        // Do nothing we did not start in the square
	return;
     } 

     var deltaX = lastX - this._downX;
     var deltaY = lastY - this._downY;

     var n = this.getState().getDim();
     var field_size_H = width/n;
     var field_size_V = height/ n;
     
     // Calculate the row we're in
     var j = Math.floor(lastX/field_size_H);
     var i = Math.floor(lastY/field_size_V);

     console.log("Got column " + j + ".");
     console.log("Got row " + i + ".");
     // NE move in the north western half

     console.log( "deltaX = " + deltaX + ".");
     console.log( "deltaY = " + deltaY + ".");
     
     if (deltaY > 0 && deltaX < 0) {
         var logicalTan = Math.abs(deltaY / deltaX); // Y coordinate grows downward (counterintuitive).
         if (Math.abs(logicalTan - this.TAN_45) < this.DIAG_EPSILON) {
             var gs = new GameShift(n);
             var mask = gs.fromCompassRose("SW", i + j); // For i < n/2 this is correct
             gs.setShift(mask);
             this.applyShift(gs, true); //Forcing history clipping if needed
             var canvas = document.getElementById("theboard");
             this._oS.draw(canvas);
         }
     } else if (deltaY > 0 && deltaX > 0) {
         var logicalTan = Math.abs(deltaY / deltaX); // Y coordinate grows downward (counterintuitive).
         if (Math.abs(logicalTan - this.TAN_45) < this.DIAG_EPSILON) {
             var gs = new GameShift(n);
             var mask = gs.fromCompassRose("SE", n - 1 - i + j); // For i < n/2 this is correct
             gs.setShift(mask);
             this.applyShift(gs, true); //Forcing history clipping if needed
             var canvas = document.getElementById("theboard");
             this._oS.draw(canvas);
         }
     } else if (deltaY < 0 && deltaX > 0) {

         var logicalTan = Math.abs(deltaY / deltaX); // Y coordinate grows downward (counterintuitive).
         if (Math.abs(logicalTan - this.TAN_45) < this.DIAG_EPSILON) {
             var gs = new GameShift(n);
             var mask = gs.fromCompassRose("NE", i + j); // For i < n/2 this is correct
             gs.setShift(mask);
             this.applyShift(gs, true); //Forcing history clipping if needed
	     
             var canvas = document.getElementById("theboard");
             this._oS.draw(canvas);  
         }

     } else if (deltaY < 0 && deltaX < 0) {

         var logicalTan = Math.abs(deltaY / deltaX); // Y coordinate grows downward (counterintuitive).
         if (Math.abs(logicalTan - this.TAN_45) < this.DIAG_EPSILON) {
             var gs = new GameShift(n);
             var mask = gs.fromCompassRose("NW", n - 1 - i + j); // For i < n/2 this is correct
             gs.setShift(mask);
             this.applyShift(gs, true); //Focing history clipping if needed

             var canvas = document.getElementById("theboard");
             this._oS.draw(canvas); 	     
         }
     } else {
	 // This should not happen; if it did, no shift was performed
         return SwipeType.NONE;
     }

     if (this.determineIfOver() == true){
	 this._game_over = true;
         this.setNoTouchMode();
	 var dflty_img_str = DifficultyIndicator.IconMap.get("congrats");
	 var imgDOM = document.getElementById("difficulty_image");
	 imgDOM.src = dflty_img_str; // For some reason redraws automatically
     }

     return this.SwipeType.NONE;
 }

Game.prototype.onMouseUp = function(event){

    if (event.which != 1) {
        return;
    }

    if (this._notouch_mode_on == true ){
         // do nothing
         return;
     }

    var lastX = event.pageX;
    var lastY = event.pageY;
   
    var rect  = event.target.getBoundingClientRect();
    lastX = event.pageX - rect.left; //x position within the element
    lastY = event.pageY - rect.top;

    if (lastX < 0 || lastY < 0 || lastX > this.gWidth || lastY > this.gHeight){
	// Do nothing we're outside of our square
	return;
    }


    var sT = this.detectSwipe(lastX, lastY);
    if (sT == this.SwipeType.NORTH){
        console.log("Detected swipe: " + sT);
	this.onSwipeNorth(lastX, lastY);
    }
    else if (sT == this.SwipeType.SOUTH){
        console.log("Detected swipe: " + sT);
	this.onSwipeSouth(lastX, lastY);
    }
    else if (sT == this.SwipeType.WEST){
        console.log("Detected swipe: " + sT);
	this.onSwipeWest(lastX, lastY);
    }
    else if (sT == this.SwipeType.EAST){
        console.log("Detected swipe: " + sT);
        this.onSwipeEast(lastX, lastY);
    }
    else {
        console.log("Detected swipe: " + sT);
	this.onDiagonalSwipe(lastX, lastY);
     }
}

/*
 This function writes an html file displaying a table with a game pannel at the center and buttons arround it.
*/
Game.prototype.display2 = function(){

var n = this.getSquareRef().dim;

////// CONFIGURATION PARAMETERS //////////

// var gWidth  = 560;  // 640  // Constructor initializes the game size to those values
// var gHeight = 560;


if (n == 6) {

    this.gWidth = 620; //680;  // 720
    this.gHeight = 620; //680; // 720
}

if ( n==8) {
    this.gWidth = 620; // 705;  // 720
    this.gHeight = 620; // 705; // 720
    }  

if ( n==9) {
    this.gWidth = 624; // 705;  //800
    this.gHeight = 624; // 705; // 800
    }  

var bCellWidth = this.gWidth/n;  // button cell width
var bCellHeight = this.gHeight/n; // button cell height

// diagonal left top button style:
    var dlt_button_style =   "style=\"height:18px;width:15px;background-image:url('NWArrow2.jpg');border:none;outline:none;padding:0px\"";  // "style=\"text-align:left;width:10px;padding:0px;border:none;outline:none;background:white\"";

// diagonal left bottom button style:
    var dlb_button_style =   "style=\"height:19px;width:15px;background-image:url('SWArrow3.jpg');border:none;outline:none;padding:0px\"";  // "style=\"text-align:left;width:10px;padding:0px;border:none;outline:none;background:white\"";
    
    
// diagonal right top button style;
    var drt_button_style =  "style=\"height:20px;width:15px;background-image:url('NEArrow3.jpg');border:none;outline:none;padding:0px\""  // "style=\"text-align:right;width:10px;padding:0px;border:none;outline:none;background:white\"";

    
// diagonal right bottom button style;
    var drb_button_style =  "style=\"height:19px;width:15px;background-image:url('SEArrow3.jpg');border:none;outline:none;padding:0px\""  // "style=\"text-align:right;width:10px;padding:0px;border:none;outline:none;background:white\"";

// diagonal top button style;
    var dt_button_style = "style=\"height:20px;width:36px;background-image:url('NWArrow3.jpg');border:none;outline:none;padding:0px\""; //"style=\"height:10px;padding:0px;border:none;outline:none;background:white\""
    
// diagonal bottom button style;
    var db_button_style =  "style=\"height:20px;width:36px;background-image:url('SWArrow2.jpg');border:none;outline:none;padding:0px\""; //"style=\"height:10px;padding:0px;border:none;outline:none;background:white\"";
    


    var dbr_button_style =  "style=\"height:20px;width:36px;background-image:url('SEArrow2.jpg');border:none;outline:none;padding:0px\""; //"style=\"height:10px;padding:0px;border:none;outline:none;background:white\"";


    
var up_button_style_1 = "style=\"width:" + bCellWidth + "px\"";
var down_button_style_1 = "style=\"width:" + bCellWidth + "px\"";
var left_button_style_1 = "style=\"height:" + bCellHeight +"px;width:25px\"";
var right_button_style_1 = "style=\"height:" + bCellHeight + "px;width:25px\"";

    var nwarr = ''; // '&nwarr;';
    var nearr = ''; // '&nearr;';
    var swarr = ''; // '&swarr;';
    var searr = ''; // '&searr;';

///// END OF CONFIGURATON PARAMETERS ///////////

    
	  document.write("<canvas id="
		       + "\"theboard\""
		       +  " height=" + "\"" + this.gHeight + "\"" + " width="
			 + "\"" + this.gWidth + "\"" + ">");




          
    

   	/** 
        ////////////////////////////////////////////////////////////////////////////
        /////////////////////// 20171227 INTERVENTION //////////////////////////////
        //////////////////////////////////////////////////////////////////////////// 
   
    document.write(

	"<table id=\"game_panel\" border=\"1\" border-padding = \"0\" cellpadding = \"0px\" cellspacing=\"0px\">");

// s --> ranges over rows
// r --> ranges over colums
    
for (s=0; s<n; s++){         ///////// TOP ROW ////////////
    if (s == 0){
	var str = "<tr><td style=\"text-align:center;width:20px;padding:0px\"><button id=\"shift_d_nw\" onClick=\"" + 
       "var n = G._oS.dim;" +
       "var gs = new GameShift(n);" + 
       "var mask = gs.fromCompassRose('NW',"+(n-1)+ ");" + 
       "gs.setShift(mask);" + 
       "G.applyShift(gs, true);" + 
       "G._oS.draw(canvas);" +
"\"" + dlt_button_style + ">" + nwarr + "</button></td>"

	console.log(str);
        document.write(str);
	
	for(r=0; r<n; r++){
            // diagonal cell left
	    if (r >= 1 && r <= n-2) {
		document.write("<td style=\"text-align:center;vertical-align:center\"><button id=\"shift_d_nw_"
			       + (n-1+r) + "\" onClick=\"" + 
     "var n = G._oS.dim;" +
        "var gs = new GameShift(n);"+
        "var mask = gs.fromCompassRose('NW',"+(n-1+r)+ ");" + 
        "gs.setShift(mask);" + 
        "G.applyShift(gs, true);" +  
        "G._oS.draw(canvas);" + 

"\"" + dlt_button_style + ">" + nwarr + "</button></td>");
	       }
	    
	    // column cell up
            document.write("<td style=\"text-align:center" + ((r==0 || r==n-1) ? ";" + "width:" + (bCellWidth+2) + "px" : "") + "\"><button id=\"shift_t_"
			   + r + "\" onClick=\"" + 
        "var n = G._oS.dim;" +
        "var gs = new GameShift(n);" + 
        "var mask = gs.fromCompassRose('N',"+ r + ");" + 
        "gs.setShift(mask);" + 
        "G.applyShift(gs, true);" +  
        "G._oS.draw(canvas);" + 

"\"" + ((r == 0 || r == n-1) ?  up_button_style_1 : "") + ">&uarr;</button></td>");


	    // diagonal cell right
	    if (r >= 1 && r <= n-2) {
		document.write("<td style=\"text-align:center;vertical-align:center\"><button id=\"shift_d_ne_"
			       + r + "\" onClick=\"" + 
        "var n = G._oS.dim;" +
        "var gs = new GameShift(n);" + 
        "var mask = gs.fromCompassRose('NE',"+ r + ");"+
        "gs.setShift(mask);" + 
        "G.applyShift(gs, true);" +
        "G._oS.draw(canvas);" + 

"\"" + drt_button_style + ">" + nearr + "</button></td>");
	       }
	}
	
        document.write("<td style=\"text-align:center\"><button id=\"shift_d_ne\" onClick=\"" +  
        "var n = G._oS.dim;" +
        "var gs = new GameShift(n);" + 
        "var mask = gs.fromCompassRose('NE',"+(n-1)+ ");" + 
        "gs.setShift(mask);" +
        "G.applyShift(gs, true);"+
        "G._oS.draw(canvas);" +

"\""+ drt_button_style + ">" + nearr + "</button></td></tr>");
    }
    
     //////// END OF TOP ROW //////////

    if (s != 0 && s != n-1 ) {

	document.write("<tr style=\"line-height:5px\"><td style=\"text-align:center;vertical-align:center;height:17px\"><button id=\"shift_d_nw_"
		       + (n-1-s) + "\" onClick=\"" + 
        "var n = G._oS.dim;" +
        "var gs = new GameShift(n);"+
        "var mask = gs.fromCompassRose('NW',"+ (n-1-s) + ");" + 
        "gs.setShift(mask);" + 
        "G.applyShift(gs, true);" +  
        "G._oS.draw(canvas);" + 
		       "\"" + dt_button_style + ">" + nwarr +"</button></td>");

	document.write("<td style=\"text-align:center;vertical-align:center;height:17px\"><button id=\"shift_d_ne_"
		       + (n-1+s) + "\" onClick=\"" + 
        "var n = G._oS.dim;" +
        "var gs = new GameShift(n);"+
        "var mask = gs.fromCompassRose('NE',"+ (n-1+s) + ");" + 
        "gs.setShift(mask);" +  
        "G.applyShift(gs, true);" +  
        "G._oS.draw(canvas);" + 
	"\"" + drt_button_style + ">" + nearr + "</button></td></tr>");
	       
	} 
    
        document.write("<tr> <td style=\"text-align:center" + ((s==0 || s==n-1) ? ";" + "height:" + (bCellHeight+2) + "px" : "") +"\"><button id=\"shift_l_" +
		   s + "\" onClick=\"" + 
        "var n = G._oS.dim;" +
        "var gs = new GameShift(n);" + 
        "var mask = gs.fromCompassRose('W',"+ s + ");" + 
        "gs.setShift(mask);" + 
        "G.applyShift(gs, true);" + 
        "G._oS.draw(canvas);" + 
		       "\"" + ((s == 0 || s == n-1) ?  left_button_style_1 : "") + ">&larr;</button></td>");


    
        if (s == 0){
	  document.write("<td rowspan=" + "\"" + (n+2*(n-2)) + "\""
		       + " colspan=" + "\"" + (n+2*(n-2)) 
		       + "\"" + "> <canvas id="
		       + "\"theboard\""
		       +  " height=" + "\"" + gHeight + "\"" + " width="
		       + "\"" + gWidth + "\"" + "></td>"); 
         }

         document.write("<td style=\"text-align:center\"><button id=\"shift_r_"
		   + s + "\" onClick=\"" + 
        "var n = G._oS.dim;" +
        "var gs = new GameShift(n);" + 
        "var mask = gs.fromCompassRose('E',"+ s + ");" + 
        "gs.setShift(mask);" + 
        "G.applyShift(gs, true);" + 
        "G._oS.draw(canvas);" + 

         "\"" + ((s == 0 || s == n-1) ?  right_button_style_1 : "") + ">&rarr;</button></td></tr>");


    if (s != 0 && s != n-1 ) {

	document.write("<tr style=\"line-height:5px;\"><td style=\"text-align:center;vertical-align:center;height:17px\"><button id=\"shift_d_sw_"
		       + s + "\" onClick=\"" + 
        "var n = G._oS.dim;" +
        "var gs = new GameShift(n);"+
	"var mask = gs.fromCompassRose('SW',"+ s + ");" + 
        "gs.setShift(mask);" + 
        "G.applyShift(gs, true);" +  
        "G._oS.draw(canvas);" + 
        "\"" + db_button_style + ">"+ swarr + "</button></td>");
	
	document.write("<td style=\"text-align:center;vertical-align:center;height:17px\"><button id=\"shift_d_se_"
		       + (2*(n-1)-s) + "\" onClick=\"" + 
        "var n = G._oS.dim;" +
        "var gs = new GameShift(n);"+
		       "var mask = gs.fromCompassRose('SE',"+ (2*(n-1)-s) + ");" + 
        "gs.setShift(mask);" + 
        "G.applyShift(gs, true);" +  
        "G._oS.draw(canvas);" + 
	"\"" + drb_button_style + ">" + searr + "</button></td></tr>");
    }
    


    if (s == n-1){ /////// BOTTOM ROW //////////
        document.write("<tr><td style=\"text-align:center;vertical-align:center\"><button id=\"shift_d_sw\" onClick=\"" +

        "var n = G._oS.dim;" +
        "var gs = new GameShift(n);" + 
        "var mask = gs.fromCompassRose('SW',"+ (n-1) + ");" + 
        "gs.setShift(mask);" + 
        "G.applyShift(gs, true);" + 
        "G._oS.draw(canvas);" + 

"\"" + dlb_button_style + ">" + swarr + "</button></td>");
	
	for(r=0; r<n; r++){

            // diagonal cell left
	    if (r >= 1 && r <= n-2) {
		document.write("<td style=\"text-align:center;vertical-align:top\"><button id=\"shift_d_sw_"
			       + (n-1+r) + "\" onClick=\"" + 
        "var n = G._oS.dim;" +
        "var gs = new GameShift(n);" + 
        "var mask = gs.fromCompassRose('SW',"+ (n-1+r) + ");" + 
        "gs.setShift(mask);" + 
        "G.applyShift(gs, true);" + 
        "G._oS.draw(canvas);" + 

"\"" + dlb_button_style + ">" + swarr + "</button></td>");
	    }
	    
            document.write("<td style=\"text-align:center\"><button id=\"shift_b_"
			   + r + "\" onClick=\"" + 
        "var n = G._oS.dim;" +
        "var gs = new GameShift(n);" +
        "var mask = gs.fromCompassRose('S',"+ r + ");" + 
        "gs.setShift(mask);" + 
        "G.applyShift(gs, true);" + 
        "G._oS.draw(canvas);" + 

"\"" + ((r == 0 || r == n-1) ?  down_button_style_1 : "") + ">&darr;</button></td>");


	    // diagonal cell right
	    if (r >= 1 && r <= n-2) {
		document.write("<td style=\"text-align:center\"><button id=\"shift_d_se_"
			       + r + "\" onClick=\"" +
        "var n = G._oS.dim;" +			       
        "var gs = new GameShift(n);" + 
        "var mask = gs.fromCompassRose('SE',"+ r + ");" + 
        "gs.setShift(mask);" + 
        "G.applyShift(gs, true); " + 
        "G._oS.draw(canvas);" + 

"\"" + drb_button_style + ">" + searr + "</button></td>");
	       }  
	}
	
        document.write("<td style=\"text-align:center\"><button id=\"shift_d_se\" onClick=\"" + 
        "var n = G._oS.dim;" +
        "var gs = new GameShift(n);" + 
        "var mask = gs.fromCompassRose('SE',"+ (n-1) + ");" + 
        "gs.setShift(mask);" + 
        "G.applyShift(gs, true); " +
        "G._oS.draw(canvas);" +

"\"" + dbr_button_style + ">" + searr + "</button></td></tr></table>");
       }          /////// END OF BOTTOM ROW
}
	
         ///////////////////////////////////////////////////////////////////////////////
         ////////////////////// 20171227 INTERVENTION END //////////////////////////////
         ///////////////////////////////////////////////////////////////////////////////

         **/

}  ///// END OF Game.prototype.display2 





/*******  TESTS OF THE GAME OBJECT *****************

document.write("TESTIING GAME OBJECT FUNCTIONALITY<br><br>");
var N = 6;
var M = 3;
var G = new Game(N, M);

document.write("***** STARTING WITH MATRIX *****<br>");
document.write(G.getState().toString());
var gs = new GameShift(N);

var mask = gs.fromCompassRose("N", 1);
gs.setShift(mask);
document.write(gs.toString() + "<br>");
G.applyShift(gs);
document.write(G.getState().toString());

mask = gs.fromCompassRose("S", 2); //Remember mask is a translation of the shift (it row/column & direction) into binary number
gs.setShift(mask);
document.write(gs.toString() + "<br>");
G.applyShift(gs);
document.write(G.getState().toString());
		
mask = gs.fromCompassRose("W", 3);
gs.setShift(mask);
document.write(gs.toString() + "<br>");
G.applyShift(gs);
document.write(G.getState().toString());
		
mask = gs.fromCompassRose("NW", 6);
gs.setShift(mask);
document.write(gs.toString() + "<br>");
G.applyShift(gs);
document.write(G.getState().toString());
	    
//mask = gs.fromCompassRose("RCW", 0);
//gs.setShift(mask);
//document.write(gs.toString());
//G.applyShift(gs);
	     
document.write("Inverting the last shift gives:<br>");	
document.write(gs.invert().toString() + "<br>");
G.applyShift(gs.invert());
document.write(G.getState().toString());

document.write("THE FINAL MATRIX IS:<br><br>");
document.write(G.getState().toString());



//        G.saveGameAndSwitchMode();
     //   OscarsSquare sQ = G.replayFromStart(4);
     //   G.saveState(sQ, false);
        
        
document.write("TESTING STEPPING BACK ...<br><br>");
        
var s = -1;
s = G.undoLastMove();
document.write("Undoing move " + (s+1) + "<br>");       
document.write(G.getState().toString());
s = G.undoLastMove();
document.write("Undoing move " +  (s+1)+"<br>");
document.write(G.getState().toString() +"<br>");

s = G.undoLastMove();
document.write("Undoing move " +(s+1)  +"<br>");
document.write(G.getState().toString() +"<br>");

s = G.undoLastMove();
document.write("Undoing move " +  (s+1)+"<br>");
document.write(G.getState().toString() +"<br>");

s = G.undoLastMove();
document.write("Undoing move " +  (s+1)+"<br>");
document.write(G.getState().toString() +"<br>");


***************** END OF  SIMPLE TESTS OF THE GAME OBJECT *******/

/**
   ("TESTING READING GAME FROM FILE. THE FILE NAME IS SecondGame_2016_07_05-10_23_17.osg");
         Mode GM = Mode.SOLVER;
         //  This should not save players moves -- it's a new game
         Game G1 = Game.readGame("SecondGame_2016_07_05-10_23_17.osg", GM, true);
         G1.saveGame();
    
         Thread.sleep(4000);
         // This should save players moves as well.
         G1 = Game.readGame("SecondGame_2016_07_05-10_23_17.osg", GM, false);
         G1.saveGame();
        
	    } catch (Exception e){
	      System.out.println(e.getMessage());
	      System.exit(1);
        }
      }
	
	public void registerListener(GameChangeListener gL){
		_listeners.add(gL);	
	}
	
	public void notifyAboutChange(){
		for (GameChangeListener gC : _listeners){
		     gC.onChange();	
		}
	}
	
	private static final String   _charset     = "UTF-8";
	private static final String   _file_ext    = ".osg";
	private static final String   _name_idr    = "\\^.*";           // Pattern which says that the next line contains the name of the game
	private static final String   _matrix_idr  = "\\*.*";           // Pattern which says that the next line in the file will be a matrix
	private static final String   _attmpt_idr  = "\\@.*";           // What follows is a list of shifts
	private static final String   _soltn_idr   = "\\%.*";           // What follows is a list of shifts of the solution
	private static final String   _name_descr  = "Game Name:";      // Human friendly names for reading/saving into files
    private static final String   _pmvs_descr  = "Player Moves:";
    private static final String   _smvs_descr  = "Solution Moves:";
    private static final String   _im_descr    = "Initial Matrix:";
    private static final String   _fm_descr    = "Final Matrix";
    private static final String   _state_descr = "Saved Sate:";
    private static final String   _mode_idr    = "\\~.*";
    private static final String   _mode_descr  = "Mode:";
    private static final String   EXPL_STRING  = "EXPLORER";
    private static final String   SLV_STRING   = "SOLVER";
	
	private String                    _name;          // Game's name
	private Matrix                    _start;         // Starting square
	private Matrix                    _final;         // Ending square (the targeted state which ends the game). Could be unset in EXPLORE mode
	private ArrayList<GameShift>      _steps_made;    // All history
	private int                       _current_step;  // Usually the last of the steps made, 
	                                                  // but we could go back and point to a previous step
	private ArrayList<GameShift>      _solution;
	private OscarsSquare              _oS;            // Holds the current matrix and executes single shifts
	private Mode                      _mode;          // Are we solving or exploring
	private List<GameChangeListener>  _listeners;       // Game change listeners to notify about new state of the game
padding:0px

*/

///////////// THE CODE THAT RUNS IN THE BROWSER /////////////

/*
var N = NaN;
var M = NaN;

N = parseInt(findGetParameter("N"));
M = parseInt(findGetParameter("M"));



if (isNaN(N) || isNaN(N)){
    N = 4;
    M = 2;
}
*/

Game.prototype.determineIfOver = function(){

    var _finalA = this._final.toString();
    console.log("_finalA = " + _finalA);
    var _playersA = this._oS.getM().toString();
    console.log("_playersA = " + _playersA);
    
    var _startA   =  this._start.toString();
    
    if ( _finalA === _playersA && ( _startA !== _finalA)){
         console.log("Game.determineIfOver: game is non-trivial and is over!");
         return true;
        }

    return false;
}

/* In java script a function is an object which can have 
   properties. Hence if you want the create a static property
   or a function you can create a function. Difficulty indicator
   is such an object/function
*/

function DifficultyIndicator(){
    var dummy_var = "just in case";
}

DifficultyIndicator.getDifficultyIconStr = function (game){

    var n = game._oS.getDim();
    var m = game._subSquareDim;
    var size_str = n + " x " + m;
    console.log(size_str);
    
    var iconFile = DifficultyIndicator.IconMap.get(size_str);
    var img_str = "<img id=\"difficulty_image\" style=\"width: 50px; height: 50px;\" src=\"" + iconFile + "\"></img>";
    console.log(img_str);
    document.write(img_str);
}

DifficultyIndicator.IconMap = new Map(); 
DifficultyIndicator.IconMap.set("3 x 3", "./icons/icons8butterfly48.png");
DifficultyIndicator.IconMap.set("4 x 2", "./icons/icons8duck48black.png");
DifficultyIndicator.IconMap.set("6 x 2", "./icons/icons8panda50.png");
DifficultyIndicator.IconMap.set("6 x 3", "./icons/icons8leopard50.png");
DifficultyIndicator.IconMap.set("8 x 2", "./icons/icons8koala50.png");
DifficultyIndicator.IconMap.set("8 x 4", "./icons/icons8tiger50.png");
DifficultyIndicator.IconMap.set("9 x 3", "./icons/icons8dinosaur50.png");
DifficultyIndicator.IconMap.set("congrats", "./icons/ic_thumb_up_outline_black_48dp.png");

console.log(N);
console.log(M);

var G = new Game(N, M);
G.display2();
var canvas = document.getElementById("theboard");

G.attachMouseDownHandler(canvas);
G.attachMouseUpHandler(canvas);

G._oS.draw(canvas);

