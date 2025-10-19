var m_array =
[-3.83174094, -3.82875714, -3.82858951,  0.25557765,  0.25558408,  0.25565396,
  0.25731949,  0.25738894,  0.25795397,  0.2583501,   0.25878481,  0.25878952,
  0.25910119,  0.25914278,  0.25918651,  0.25920323,  0.2592551,   0.25941758,
  0.25943216,  0.25960621,  0.25970353,  0.26024413,  0.2612233,   0.26149938,
  0.26180591,  0.26189379,  0.26286396,  0.26289525,  0.2629347,   0.26294198,
  0.26298228,  0.26309417,  0.26309546,  0.2631199,   0.26319406,  0.26326309,
  0.26327895,  0.26331196,  0.26336469,  0.26337326,  0.26340542,  0.26351645,
  0.26352074,  0.26356061,  0.26357604,  0.26366221,  0.26798487]

 ];

var m = 19409990.659574468;
var s = 2332593.799496177;
var P = 1537;
var r = 3;
var c = 16;

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
