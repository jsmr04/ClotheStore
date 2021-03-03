
(function () {
  "use strict";

  console.log("Lets try this");

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyDcB0CQFIgzUeIMOow8oP9Gnf7qRfy4BRM",
    authDomain: "clothestore-484a8.firebaseapp.com",
    databaseURL: "https://clothestore-484a8-default-rtdb.firebaseio.com",
    projectId: "clothestore-484a8",
    storageBucket: "clothestore-484a8.appspot.com",
    messagingSenderId: "521700687251",
    appId: "1:521700687251:web:4bb8ebe4caa43e42ce3c66",
    measurementId: "G-3LNCC7WFPF"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
})();

function getDate() {
  return new Date(new Date().toString().split("GMT")[0] + " UTC")
    .toISOString()
    .split(".")[0]
    .replace("T", " ");
}

function signOut(fromIndex = false) {
  firebase
    .auth()
    .signOut()
    .then(() => {
      if(fromIndex){
        window.location.href = `index.html`;
      }else{
        window.location.href = `../pages/login.html`;
      }
    })
    .catch((error) => {
      // An error happened.
    });
}

function checkAuth(fromIndex = false) {
  firebase.auth().onAuthStateChanged((user) => {
    let userName = document.getElementById("userName");
    let divLoggedIn = document.getElementById("userLoggedIn");
    let divNotLoggedIn = document.getElementById("userNotLoggedIn");

    if (user) {
      userName.innerHTML = user.email;
      //Only for index
      //console.log(divLoggedIn)
      if (divLoggedIn != undefined) {
        divLoggedIn.removeAttribute('hidden');
      }

      if (divNotLoggedIn != undefined) {
        divNotLoggedIn.setAttribute('hidden', true);
      }
    } else {
      if(fromIndex){
        //
        if (divLoggedIn != undefined) {
          divLoggedIn.setAttribute('hidden', true);
        }
  
        if (divNotLoggedIn != undefined) {
          divNotLoggedIn.removeAttribute('hidden');
        }
      }else{
        window.location.href = `../pages/login.html`;
      }
    }
  });
}
