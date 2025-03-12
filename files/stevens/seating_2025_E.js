// This function is called when button is clicked
var m_array =
[-3.2098009, -1.88649346, -1.87971545, -1.24577185, -1.05379459, -1.03784632,
 -0.96209205, -0.67263101, -0.22986726, -0.05304085, -0.00360122, 0.2786831,
 0.39331127, 0.41862914, 0.4192272, 0.43936189, 0.44454507, 0.45730369,
 0.47046101, 0.53764308, 0.57811181, 0.58748141, 0.5956549, 0.61339735,
 0.61678635, 0.62376372, 0.81454486, 0.88132823, 1.00253506, 1.02765358,
 1.02805228
 ];

var m = 20029423.06451613;
var s = 5016.219087253023;
var P = 1877;
var r = 8;
var c = 4;

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
    return [E, 2*F-1]        //Special Customization for section E
}


function findSeating() {
    var studentID = document.getElementById("myTextbox").value;
        var assignedSeatTextBox = document.getElementById("assignedSeat");

        // Assign the paragraph element a value
    assignedSeatTextBox.innerHTML = String(funcB(studentID));

    }

document.getElementById("myButton").addEventListener("click", findSeating);
