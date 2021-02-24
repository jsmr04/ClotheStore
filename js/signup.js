const email = document.getElementById("inputEmail");
const password = document.getElementById("inputPassword");
const confirmPassword = document.getElementById("inputConfirmPassword");
const firstName = document.getElementById("inputFirstName");
const lastName = document.getElementById("inputLastName");
const errorMesssage = document.getElementById("errorMessage");

//Prevent page reload
let form = document.getElementById("form-register");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);

let user;
function createNewAccount() {
  errorMesssage.innerHTML = '';
  errorMesssage.setAttribute('hidden',true);

  if (validateFields()) {
    //Validate passwords
    if(password.value != confirmPassword.value ){
        errorMesssage.innerHTML = 'Passwords do not match.';
        errorMesssage.removeAttribute('hidden');
        return false;
    }

    console.log(`createNewAccount ${email.value} ${password.value}` );
    firebase
      .auth()
      .createUserWithEmailAndPassword(email.value, password.value)
      .then((userCredential) => {
        // Signed in
        user = {
            email: userCredential.user.email,
            firstName: firstName.value,
            lastName: lastName.value,
            type: 'customer',
        }
        
        //console.log(userCredential.user)
        //Storing user information
        firebase
        .database()
        .ref(`userInfo/${userCredential.user.uid}`)
        .set(user)
        .then(() =>{
            //window.location.href = './questions-quiz.html?firstName=' + firstName.value + '&lastName=' + lastName.value + '&email=' + email.value;
            window.location.href = `./customer-info.html?email=${email.value}`;
        });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('Error');
        console.log(errorMessage);

        errorMesssage.innerHTML = errorMessage;
        errorMesssage.removeAttribute('hidden');
        // ..
      });
  }

  return false;
}

function validateFields() {
  if (
    email.value != "" &&
    password.value != "" &&
    confirmPassword.value != "" &&
    firstName.value != "" &&
    lastName.value != ""
  ) {
    return true;
  } else {
    return false;
  }
}

