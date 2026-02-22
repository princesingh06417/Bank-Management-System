//desable calender for 18<age 

const dobInput = document.getElementById("dob");
const today = new Date();
const minAge = 18;


const maxDate = new Date(
  today.getFullYear() - minAge,
  today.getMonth(),
  today.getDate()
);


const maxDateString = maxDate.toISOString().split("T")[0];


dobInput.setAttribute("max", maxDateString);

function validateForm() {
  const dob = dobInput.value;

  if (!dob) {
    alert("Please enter your date of birth.");
    return false;
  }
  return true; 
}

function createAccountresetForm() {
  document.getElementById("account-form").reset();
}

function logout() {
 
  fetch("/logout")
    .then((response) => {
      if (response.ok) {
       
        window.location.href = "/login.html";
      } else {
        alert("Failed to log out");
      }
    })
    .catch((error) => {
      console.error("Error during logout:", error);
    });
}




//Auto fill enddate(Curent date is end date) in View balence

function setEndDateToTomorrow() {
  const startDateInput = document.getElementById('endDate');
  const today = new Date();

 
  const formattedDate = today.toISOString().split('T')[0];


  startDateInput.value = formattedDate;
}
window.addEventListener('load', function() {
  
  setEndDateToTomorrow();
});

document.addEventListener('DOMContentLoaded', function() {
  
  setEndDateToTomorrow();
});