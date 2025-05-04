
// This function is called when button is clicked
var m_array =
[-3.04302827 , -3.03824404 , -2.42757148 ,-2.30796577 ,-1.60775979 ,-1.50131071 ,
 -1.46850458,  -1.46679592,  -1.37657905, -1.3704279 , -1.19375318, -0.75702149,
 -0.20495572,  -0.19658332,  -0.19350775, -0.18547708, -0.18445189, -0.18223064,
 -0.08637521,  -0.08466655,  -0.03938725, -0.03819119,  0.20939262,  0.21486031,
  0.21673983,   0.21947367,   0.31942987,  0.36590523,  0.36915167,  0.38350435,
  0.38452954,   0.38555474,   0.38657993,  0.39512319,  0.39717358,  0.48892824,
  0.50601477,   0.52925245,   0.53796658,  0.54650984,  0.5600082 ,  0.56205859,
  0.56530503,   0.57692387,   0.58478367,  0.59093482,  0.59178915,  0.59486472,
  0.69499179,   0.71549562,   0.72267196,  0.72523494,  0.75052301,  0.75188993,
  0.87833025,   0.88020976,   0.88772784,  0.89746716,  0.94565117,  1.30822733,
  1.30839819];

var m = 20029465.01639344;
var s = 5852.563575867187;
var P = 1877;
var r = 12;
var c = 10;

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
