
// This function is called when button is clicked
function findSeating() {

        var studentID = document.getElementById("myTextbox").value;

        var assignedSeatTextBox = document.getElementById("assignedSeat");

        // Assign the paragraph element a value
        assignedSeatTextBox.innerHTML = studentID

    }
    
document.getElementById("myButton").addEventListener("click", findSeating);