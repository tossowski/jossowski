// This function is called when button is clicked
var m_array =
[-3.47590419 ,-3.245145   ,-3.17054446 ,-3.16706568 ,-1.88107604 ,-1.53938238 ,
 -1.49725046, -1.08037646, -1.06491521, -1.03206004, -0.8826657 , -0.80362005,
 -0.71085253, -0.28160953, -0.25667826, -0.15096195, -0.14477745, -0.13414784,
 -0.11018289, -0.1096031 , -0.10786371, -0.10090614, -0.06650486, -0.06225301,
  0.17314455,  0.17913578,  0.188026  ,  0.19652969,  0.20310072,  0.21141115,
  0.31171602,  0.314615  ,  0.3225389 ,  0.34708363,  0.34766343,  0.35017588,
  0.3540412 ,  0.35809978,  0.36718326,  0.37220817,  0.38457717,  0.39559331,
  0.3973327 ,  0.46845446,  0.47831101,  0.4856551 ,  0.50169615,  0.51077964,
  0.51870353,  0.51966986,  0.52411497,  0.52527456,  0.53358499,  0.53590417,
  0.53918969,  0.54595399,  0.57088526,  0.58016201,  0.59678285,  0.60432021,
  0.62113432,  0.74366475,  0.76202498,  0.76299131,  0.79565321,  0.91315872,
  0.92030955,  0.93751019,  0.93789673,  0.93963612,  0.95084552,  0.96398759];
var m = 20029727.111111112;
var s = 5174.22521992841;
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
