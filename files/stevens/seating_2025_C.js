// This function is called when button is clicked
var m_array =
[-2.48280092, -2.19893519, -2.19506931, -2.11761373, -1.8053062, -1.60497099,
 -1.03917247, -0.95315674, -0.92664787, -0.9252672, -0.85236783, -0.84739742,
 -0.80349212, -0.70463615, -0.44106627, -0.35173693, 0.09435752, 0.1011228,
  0.10360801, 0.11009715, 0.11092556, 0.19017601, 0.19155668, 0.2291109,
  0.42916997, 0.43358811, 0.43510685, 0.45485043, 0.51808511, 0.55563933,
  0.57068863, 0.57924879, 0.68763137, 0.71414023, 0.72615206, 0.72794693,
  0.73250314, 0.73816389, 0.82155635, 0.83812439, 0.8439232, 0.86642812,
  0.86753266, 0.96970223, 0.97122097, 0.97550105, 1.02410063, 1.31707878,
  1.31721685];


var m = 20027582.08163265;
var s = 7242.860881477577;
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
