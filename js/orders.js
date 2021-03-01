let urlParams = new URLSearchParams(window.location.search);
let paramUserId;
let statusSelect = document.getElementById('statusSelect');
let addressInput = document.getElementById('addressInput');
let stateInput = document.getElementById('stateInput');
let zipInput = document.getElementById('zipInput');
let countrySelect = document.getElementById('countrySelect');

if (urlParams.has("userId")) {
  paramUserId = urlParams.get("userId");
}

class Order {
  constructor(
    orderId,
    dateTime,
    fullName,
    email,
    address,
    state,
    country,
    zip,
    cardName,
    cardNumber,
    cardExpDate,
    cardCVV,
    subTotal,
    tax,
    total,
    status,
    items
  ) {
    this.orderId = orderId;
    this.dateTime = dateTime;
    this.fullName = fullName;
    this.email = email;
    this.address = address;
    this.state = state;
    this.country = country;
    this.zip = zip;
    this.cardName = cardName;
    this.cardNumber = cardNumber;
    this.cardExpDate = cardExpDate;
    this.cardCVV = cardCVV;
    this.cardExpDate = cardExpDate;
    this.cardCVV = cardCVV;
    this.subTotal = subTotal;
    this.tax = tax;
    this.total = total;
    this.status = status;
    this.items = items;
  }

  save(key) {
    firebase.database().ref(`order/${key}`).set(this);
  }
}

let orderList = [];
let orderIndex = -1;

fillCountryDropdown() ;
getOrders();

function getOrders() {
  let ordersBody = document.getElementById("ordersBody");
  const orderRef = firebase.database().ref("order/");

  orderRef.on("value", function (snapshot) {
    ordersBody.innerHTML = "";
    orderList = [];
    snapshot.forEach(function (childSnapshot) {
      let childKey = childSnapshot.key;
      let childData = childSnapshot.val();

      let order = new Order(
        childData.orderId,
        childData.dateTime,
        childData.fullName,
        childData.email,
        childData.address,
        childData.state,
        childData.country,
        childData.zip,
        childData.cardName,
        childData.cardNumber,
        childData.cardExpDate,
        childData.cardCVV,
        childData.subTotal,
        childData.tax,
        childData.total,
        childData.status,
        childData.items
      );

      orderList.push({
        key: childKey,
        order: order,
      });
    });
    console.log('ORDER')
    console.log(orderList)
    //Fill table0.
    fillTable();
  });
}

function fillTable() {
  let tableBody = document.getElementById("ordersBody");
  let counter = 0;
  tableBody.innerHTML = ''

  orderList.forEach((ol) => {
    let tr = document.createElement("tr");
    tr.setAttribute("id", "row-" + counter);

    let tdIndex = document.createElement("td");
    tdIndex.innerHTML = counter + 1;
    tr.appendChild(tdIndex);
    //Order number
    let tdOrderId = document.createElement("td");
    let aOrderId = document.createElement("a");
    aOrderId.setAttribute('href', `orders-view.html?orderKey=${ol.key}`);
    aOrderId.innerText = ol.order.orderId;
    tdOrderId.appendChild(aOrderId);
    tr.appendChild(tdOrderId);
    //Name
    let tdName = document.createElement("td");
    tdName.innerHTML = ol.order.fullName;
    tr.appendChild(tdName);
    //Shipping info
    let tdShippingInfo = document.createElement("td");
    let aShipping = document.createElement("a");
    aShipping.setAttribute("href", "#");
    
    if (ol.order.status.toUpperCase() == 'PENDING'){
        aShipping.setAttribute("data-toggle", "modal");
        aShipping.setAttribute("data-target", "#shippingInfoModal");
    }
    
    aShipping.innerHTML = `${ol.order.status.toUpperCase()}`;
    aShipping.innerHTML = `${ol.order.address}, ${ol.order.state}, ${ol.order.zip}. ${ol.order.country}`;
    aShipping.setAttribute('onclick', `updateShippingFields(${counter})`);
    tdShippingInfo.appendChild(aShipping);
    tr.appendChild(tdShippingInfo);
    //Status
    let tdStatus = document.createElement("td");
    let aStatus = document.createElement("a");
    aStatus.setAttribute("href", "#");
    aStatus.setAttribute("data-toggle", "modal");
    aStatus.setAttribute("data-target", "#changeStatusModal");
    aStatus.innerHTML = `${ol.order.status.toUpperCase()}`;
    aStatus.setAttribute('onclick', `updateStatusSelect(${counter})`);
    tdStatus.appendChild(aStatus);

    tr.appendChild(tdStatus);

    tableBody.appendChild(tr);

    counter++;
  });
}

function updateStatusSelect(index){
    orderIndex = index;
    statusSelect.value = orderList[orderIndex].order.status;
}

function updateShippingFields(index){
    orderIndex = index;

    addressInput.value = orderList[orderIndex].order.address;
    stateInput.value = orderList[orderIndex].order.state;
    zipInput.value = orderList[orderIndex].order.zip;
    countrySelect.value = orderList[orderIndex].order.country;
}

function updateOrderStatus(){
    orderList[orderIndex].order.status = statusSelect.value;
    //Save data
    orderList[orderIndex].order.save(orderList[orderIndex].key); 
}

function updateShippingInfo(){
    orderList[orderIndex].order.address = addressInput.value;
    orderList[orderIndex].order.state = stateInput.value;
    orderList[orderIndex].order.zip = zipInput.value;
    orderList[orderIndex].order.country = countrySelect.value;
    //Save data
    orderList[orderIndex].order.save(orderList[orderIndex].key); 
}

function fillCountryDropdown() {
    let countries = getCountries();
  
    countries.forEach((country) => {
      let option = document.createElement("option");
      option.innerHTML = country;
  
      countrySelect.appendChild(option);
    });

  }