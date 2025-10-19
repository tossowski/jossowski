// This function is called when button is clicked
var m_array =
[-5.56772932,  0.1699471,   0.1724895,   0.17329625,  0.17448383,  0.17504633,
  0.17819575,  0.17820537,  0.17823305,  0.17874442,  0.17878232,  0.17880999,
  0.17881119,  0.18033747,  0.18035372,  0.18039342,  0.18043012,  0.18052578,
  0.1805342,   0.18081214,  0.18093668,  0.1809469,  0.18098721,   0.18107023,
  0.18113581,  0.18114724,  0.18121161,  0.18122785,  0.18130847,  0.18470635,
  0.18729086,  0.18730891];


var m = 19723668.9375;
var s = 1662211.7209832005;
var P = 1537;
var r = 9;
var c = 5;

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
    return [F, E]
}


function findSeating() {
    var studentID = document.getElementById("myTextbox").value;
        var assignedSeatTextBox = document.getElementById("assignedSeat");

        // Assign the paragraph element a value
    assignedSeatTextBox.innerHTML = String(funcB(studentID));

    }

document.getElementById("myButton").addEventListener("click", findSeating);
