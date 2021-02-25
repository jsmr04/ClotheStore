(function () {
  "use strict";

  console.log("Lets try this");

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyD-uX9P8w2g7UZBLHXXB1m-4By0UwoqEY0",
    authDomain: "onlinestore-b2293.firebaseapp.com",
    databaseURL: "https://onlinestore-b2293-default-rtdb.firebaseio.com",
    projectId: "onlinestore-b2293",
    storageBucket: "onlinestore-b2293.appspot.com",
    messagingSenderId: "1044761175154",
    appId: "1:1044761175154:web:b7a15b863d35d7cf564eeb",
    measurementId: "G-NE6ZW9YZ44",
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
      console.log(divLoggedIn)
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
