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

function saveCategory() {
  const categoryName = document.getElementById("categoryInput").value;

  if (categoryName.trim() != '') {
    const now = getDate();

    const category = {
      categoryName: categoryName,
      dateTime: now,
      active: true,
    };

    console.log(category);
    firebase.database().ref(`category/${category.categoryName}`).set(category);

    console.log("Category saved");
    console.log(category);
  }
  document.getElementById("categoryInput").value = '';
}

function getCategories() {
  const tableBody = document.getElementById("categoryBody");
  const categoryRef = firebase.database().ref("category/");
  let counter = 1;

  categoryRef.on("value", function (snapshot) {
    tableBody.innerHTML = "";
    snapshot.forEach(function (childSnapshot) {
      let tr = document.createElement("tr");
      tr.setAttribute("id", "row-" + counter);

      let childKey = childSnapshot.key;
      let childData = childSnapshot.val();

      let tdIndex = document.createElement("td");
      tdIndex.innerHTML = counter;
      tr.appendChild(tdIndex);

      let tdName = document.createElement("td");
      tdName.innerHTML = childKey;
      tr.appendChild(tdName);

      let tdDate = document.createElement("td");
      tdDate.innerHTML = childData["dateTime"];
      tr.appendChild(tdDate);

      let aStatus = document.createElement("a");
      let elementId = "row-" + counter;

      //aStatus.setAttribute('category',childKey);
      aStatus.innerHTML = childData["active"] ? "Active" : "Inactive";
      aStatus.setAttribute("href", "#");
      aStatus.setAttribute("onClick", `showStatusModal('${elementId}')`);

      //Show modal
      aStatus.setAttribute("data-toggle", "modal");
      aStatus.setAttribute("data-target", "#changeStatusModal");

      //data-toggle="modal" data-target="#changeStatusModal"
      let tdStatus = document.createElement("td");
      tdStatus.appendChild(aStatus);
      tr.appendChild(tdStatus);

      // let tdDelete = document.createElement("td");
      // tdDelete.innerHTML = '<i class="bi-trash-fill"></i>';
      // tr.appendChild(tdDelete);

      tableBody.appendChild(tr);
      counter++;
    });
  });
}

function changeCategoryStatus(elementId) {
  const row = document.getElementById(elementId);
  const categoryName = row.childNodes[1].innerHTML;
  const categoryDateTime = row.childNodes[2].innerHTML;
  const categoryStatus = row.childNodes[3].childNodes[0].innerHTML;

  const isActive = categoryStatus === "Active" ? true : false;

  const category = {
    categoryName: categoryName,
    dateTime: categoryDateTime,
    active: !isActive,
  };

  console.log(category);

  firebase.database().ref(`category/${categoryName}`).set(category);

  //location.reload();
}
