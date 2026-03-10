// This function is called when button is clicked
var m_array =
 [-7.28002697,  0.11177783,  0.12620663,  0.1265391 ,  0.13021954 , 0.13044196 ,
  0.13047296 , 0.1365365  , 0.13654657 , 0.13655045 , 0.13659695  ,0.13663957  ,
  0.13669305 , 0.13671552 , 0.1367411  , 0.13683952 , 0.13686045  ,0.13692322  ,
  0.13720454 , 0.13720764 , 0.13753159 , 0.13753934 , 0.13758661  ,0.13761994  ,
  0.13845848 , 0.1388049  , 0.13883978 , 0.13884985 , 0.1389041   ,0.13890797  ,
  0.13897307 , 0.13909862 , 0.13912265 , 0.13967134 , 0.13969072  ,0.13976279  ,
  0.13981937 , 0.13982402 , 0.13991081 , 0.13993639 , 0.13994569  ,0.14004179  ,
  0.14015571 , 0.14016734 , 0.14023631 , 0.14030684 , 0.14056568  ,0.14063233  ,
  0.14064938 , 0.14068426 , 0.14070596 , 0.14094    , 0.14096093  ,0.14138562
 ];
                        
var m = 19861770.055555556;
var s = 1290335.886731829;
var P = 1877;
var r = 7;
var c = 8;

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
