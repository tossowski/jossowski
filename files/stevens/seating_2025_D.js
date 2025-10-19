var m_array =
[
-7.61568245,   0.12165051,  0.12170246,  0.12175279,  0.1223884,   0.12276344,
  0.12278779,  0.12397785,  0.12431392,  0.12434558,  0.12458667,  0.12462158,
  0.12628814,  0.12949137,  0.12949624,  0.12950355,  0.12950599,  0.12953683,
  0.12957986,  0.12960827,  0.12961801,  0.12963587,  0.13074231,  0.13215884,
  0.1322108 ,  0.13229766,  0.13248842,  0.13249816,  0.13254037,  0.13262886,
  0.13267107,  0.13268812,  0.13268974,  0.13283017,  0.13292596,  0.13292678,
  0.1330664,   0.13310131,  0.13310699,  0.13312322,  0.13325716,  0.13331074,
  0.1333286,   0.13338624,  0.13353398,  0.1335697,   0.13358755,  0.13362246,
  0.13375884,  0.1344805,   0.13472484,  0.13473783,  0.13610322,  0.13706598,
  0.13840459,  0.13973101,  0.14168981,  0.14173689,  0.14177829
 ];

var m = 19860385.77966102;
var s = 1231879.1310514617;
var P = 1537;
var r = 6;
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
    return [F, E]
}


function findSeating() {
    var studentID = document.getElementById("myTextbox").value;
        var assignedSeatTextBox = document.getElementById("assignedSeat");

        // Assign the paragraph element a value
    assignedSeatTextBox.innerHTML = String(funcB(studentID));

    }

document.getElementById("myButton").addEventListener("click", findSeating);
