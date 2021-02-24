let inputFirstName = document.getElementById("inputFirstName");
let inputLastName = document.getElementById("inputLastName");
let inputEmail = document.getElementById("inputEmail");
let inputAddress = document.getElementById("inputAddress");
let inputCountry = document.getElementById("inputCountry");
let inputState = document.getElementById("inputState");
let inputZip = document.getElementById("inputZip");
let uid;

//Prevent page reload
let form = document.getElementById("form-register");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    uid = user.uid;
    getUserInfo();
  }
});

fillCountryDropdown();

function fillCountryDropdown() {
  let countries = getCountries();

  countryList.forEach((country) => {
    let option = document.createElement("option");
    option.innerHTML = country;

    inputCountry.appendChild(option);
  });

  inputCountry.value = "Canada"; //Default
}

function saveUserInfo() {
  const userInfo = {
    firstName: inputFirstName.value,
    lastName: inputLastName.value,
    email: inputEmail.value,
    address: inputAddress.value,
    country: inputCountry.value,
    state: inputState.value,
    zip: inputZip.value,
  };

  firebase
    .database()
    .ref(`userInfo/${uid}`)
    .set(userInfo)
    .then(() => {
      //TODO: Implement redirect
      window.location.href = `../index.html`;
    });

    return false;
}

function getUserInfo() {
  const userInfoRef = firebase.database().ref(`userInfo/${uid}`);
  console.log(uid);
  userInfoRef.on("value", function (snapshot) {
    let childData = snapshot.val();

    if (childData["firstName"] != undefined) {
      inputFirstName.value = childData["firstName"];
    }

    if (childData["lastName"] != undefined) {
      inputLastName.value = childData["lastName"];
    }

    if (childData["email"] != undefined) {
      inputEmail.value = childData["email"];
    }

    if (childData["address"] != undefined) {
      inputAddress.value = childData["address"];
    }

    if (childData["country"] != undefined) {
      inputCountry.value = childData["country"];
    }

    if (childData["state"] != undefined) {
      inputState.value = childData["state"];
    }

    if (childData["zip"] != undefined) {
      inputZip.value = childData["zip"];
    }
  });
}
