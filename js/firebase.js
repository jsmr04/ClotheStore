(function () {
  'use strict'

  console.log('Lets try this');
  const saveButton = document.getElementById('saveCategory');

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
    measurementId: "G-NE6ZW9YZ44"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

})();

function saveCategory() {
  const categoryName = document.getElementById('category').value;
  const category = { 'categoryName': categoryName };

  firebase.database()
    .ref(`category/${category.categoryName}`)
    .set(category)

  console.log('Category saved');
  console.log(category);
}