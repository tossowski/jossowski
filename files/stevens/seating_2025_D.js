// This function is called when button is clicked
var m_array =
[-3.75911729, -3.51863458, -3.43726522, -3.05116357, -1.69708878, -1.05660718,
 -0.97423077, -0.40444384, -0.40424243, -0.29407154, -0.28762644, -0.27654893,
 -0.25096994, -0.24915726, -0.24190652, -0.23606565, -0.20605567, 0.04369188,
 0.04993556, 0.05920039, 0.0680624, 0.06906945, 0.07491032, 0.18810235,
 0.19112349, 0.22717576, 0.2281828, 0.23221099, 0.23644059, 0.245504,
 0.26242239, 0.2648393, 0.26604775, 0.27551399, 0.27853513, 0.3514453,
 0.36171718, 0.36937073, 0.38669193, 0.40481877, 0.40683286, 0.40945118,
 0.41065964, 0.41932024, 0.4444964, 0.45456687, 0.45819223, 0.46785988,
 0.4704782, 0.47672189, 0.48518108, 0.50693329, 0.51055866, 0.5115657,
 0.63825216, 0.65738604, 0.65839309, 0.665241, 0.82234027, 0.8424812,
 0.85295448, 0.85678126, 0.86785877, 0.86826159, 1.04086937];

var m = 20030406.56923077;
var s = 4965.013799560126;
var P = 1877;
var r = 6;
var c = 12;

function funcA(x){

    if ( x >= m_array[m_array.length-1]){
	return -1;
    }
    if (x <= m_array[0]){
	return -1;
    }
    for (let i=0; i<m_array.length-1; i++){
        if (x > m_array[i] && x < m_array[i+1]){
            return (i+1);
	}
    }

    return -1;
}

function funcB(id){
    var A = (id - m)/s;
    var B = funcA(A);
    if (B == -1)
	return -1;
    var C = (B*P) % (r*c);
    var D = C-1;
    var E = Math.floor(D/c)+1
    var F = (D % c) + 1
    return [E, F]
}


function findSeating() {
    var studentID = document.getElementById("myTextbox").value;
        var assignedSeatTextBox = document.getElementById("assignedSeat");

        // Assign the paragraph element a value
    assignedSeatTextBox.innerHTML = String(funcB(studentID));

    }

document.getElementById("myButton").addEventListener("click", findSeating);
