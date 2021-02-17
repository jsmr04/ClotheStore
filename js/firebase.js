(function () {
  'use strict'

    console.log('Lets try this');

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

function saveCategory(){
    const categoryName = document.getElementById('category').value;
    //const date = new Date();
    const now = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0].replace('T',' ');
    const category = {
                        'categoryName': categoryName,
                        'dateTime': now,
                    };

  firebase.database()
    .ref(`category/${category.categoryName}`)
    .set(category);
    
    console.log('Category saved');
    console.log(category);
}

function getCategories(){
    const tableBody = document.getElementById("categoryBody");
    const categoryRef = firebase.database().ref('category/');
    let counter = 1;

    categoryRef.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            let tr = document.createElement("tr");
            let childKey = childSnapshot.key;
            let childData = childSnapshot.val();
            
            let tdIndex = document.createElement("td");
            tdIndex.innerHTML = counter++;
            tr.appendChild(tdIndex);

            let tdName = document.createElement("td");
            tdName.innerHTML = childKey;
            tr.appendChild(tdName);

            let tdDate = document.createElement("td");
            tdDate.innerHTML = childData["dateTime"];
            tr.appendChild(tdDate);

            let tdDelete = document.createElement("td");
            tdDelete.innerHTML = '<i class="bi-trash-fill"></i>';
            tr.appendChild(tdDelete);

            tableBody.appendChild(tr);
        });
    });

}