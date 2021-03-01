let urlParams = new URLSearchParams(window.location.search);
//Getting params
let paramNextPage;
if (urlParams.has("nextPage")) {
    paramNextPage = urlParams.get("nextPage");
}

//Prevent page reload
let form = document.getElementById("form-signin");

function handleForm(event) { event.preventDefault(); }
form.addEventListener('submit', handleForm);

function loginRequest() {
    let email = document.getElementById('inputEmail').value;
    let lowerEmail = email.toLowerCase();
    let password = document.getElementById('inputPassword').value;
    let errorMessage = document.getElementById('errorMessage');
    errorMessage.setAttribute('hidden', true);

    firebase.auth().signInWithEmailAndPassword(email, password).then((success) => {

        if (lowerEmail.includes('admin')) {
            window.location.href = "../admin/home.html";
        } else {
            if (paramNextPage != undefined){
                if (paramNextPage === 'checkout'){
                    window.location.href = "../checkout.html";    
                }
            }else{
                window.location.href = "../index.html";
            }
        }

    }).catch((error) => {
        // Handle Errors here.
        console.log(error)
        errorMessage.innerHTML = error.message;
        errorMessage.removeAttribute('hidden');
    });

    return false;
}