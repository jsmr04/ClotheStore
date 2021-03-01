let userAuth;

getOrders();

function getOrders() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      getOrderList(user);
    }
  });
}

function getOrderList(user) {
  let mainContainer = document.getElementById("mainContainer");
  const orderRef = firebase.database().ref("order/");

  orderRef
    .orderByChild("userId")
    .equalTo(user.uid)
    .on("value", function (snapshot) {
      mainContainer.innerHTML = "";

      snapshot.forEach(function (childSnapshot) {
        console.log("HERE");
        let itemDiv = document.createElement("div");
        let orderInfoDiv = document.createElement("div");
        let orderNumberDiv = document.createElement("div");
        let totalDiv = document.createElement("div");
        let itemsDiv = document.createElement("div");
        let itemsChildDiv = document.createElement("div");
        let statusDiv = document.createElement("div");
        let statusChildDiv = document.createElement("div");
        let dividerHr = document.createElement("hr");

        let childKey = childSnapshot.key;
        let childData = childSnapshot.val();

        //Main
        itemDiv.setAttribute("class", "d-flex cont");

        orderInfoDiv.setAttribute("class", "cont");
        //Order id
        orderNumberDiv.setAttribute("class", "d-flex");
        orderNumberDiv.innerHTML = '<div class="">Order # : </div>';
        orderNumberDiv.innerHTML += `<div class="text-dark font-weight-bold ml-lg-2">${childData.orderId}</div>`;
        orderInfoDiv.appendChild(orderNumberDiv);
        //Total
        totalDiv.setAttribute("class", "d-flex");
        totalDiv.innerHTML = '<div class="">Total : </div>';
        totalDiv.innerHTML += `<div class="text-dark font-weight-bold ml-lg-2">${formatter.format(
          childData.total
        )}</div>`;
        orderInfoDiv.appendChild(totalDiv);

        //items
        itemsDiv.setAttribute("class", "cont");
        itemsChildDiv.setAttribute("class", "qtt");
        itemsChildDiv.innerHTML = `<div class="text-dark font-weight-bold text-lg">${childData.items.length} Items</div>`
        itemsDiv.appendChild(itemsChildDiv);

        //Status
        statusDiv.setAttribute("class", "cont rel");
        statusChildDiv.setAttribute("class", "qtt");
        statusChildDiv.innerHTML = `<div class="align-right font-weight-bold text-success ">${childData.status.toUpperCase()}</div>`
        statusDiv.appendChild(statusChildDiv);
        

        itemDiv.appendChild(orderInfoDiv);
        itemDiv.appendChild(itemsDiv);
        itemDiv.appendChild(statusDiv);
        
        mainContainer.appendChild(itemDiv);
        mainContainer.appendChild(dividerHr);
      });
    });
}
