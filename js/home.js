
getCategories();
getproducts();

function getCategories() {
    const cont = document.getElementById("qt-categ");
    const categoryRef = firebase.database().ref("category/");
    let count = 0
    categoryRef.on("value", function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        count++;
        console.log(count);
        cont.innerHTML = count;
      });
      //This script below enables the Jquery to work properly(search, filter, pagination)
    });
}

function getproducts() {
    const cont = document.getElementById("qt-prod");
    const Ref = firebase.database().ref("product/");
    let count = 0
    Ref.on("value", function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        count++;
        console.log(count);
        cont.innerHTML = count;
      });
      //This script below enables the Jquery to work properly(search, filter, pagination)
    });
}
  