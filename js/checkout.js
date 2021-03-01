let userAuth;

//Shipping info
let fnameInput = document.getElementById("fname");
let emailInput = document.getElementById("email");
let addressInput = document.getElementById("adr");
let stateInput = document.getElementById("state");
let zipInput = document.getElementById("zip");
let countryInput = document.getElementById("country");

//Payment info
let cardNameInput = document.getElementById("cname");
let cardNumberInput = document.getElementById("ccnum");
let cardMonthInput = document.getElementById("expmonth");
let cardDateInput = document.getElementById("expdate");
let cvvInput = document.getElementById("cvv");

//Totals
let taxAmountDiv = document.getElementById("taxAmount");
let shippingFeeDiv = document.getElementById("shippingFee");
let totalDiv = document.getElementById("total");

//Prevent page reload
let form = document.getElementById("orderForm");

function handleForm(event) { event.preventDefault(); }
form.addEventListener('submit', handleForm);

getCustomerInfo();

function getCustomerInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      userAuth = user;
      getCustomer();
    }
  });
}

function getCustomer() {
  const categoryRef = firebase.database().ref(`userInfo/${userAuth.uid}`);
  categoryRef.orderByKey().on("value", function (snapshot) {
    let childData = snapshot.val();

    fnameInput.value = `${childData["firstName"]} ${childData["lastName"]}`;
    emailInput.value = `${childData["email"]}`;
    addressInput.value = `${childData["address"]}`;
    stateInput.value = `${childData["state"]}`;
    zipInput.value = `${childData["zip"]}`;
    countryInput.value = `${childData["country"]}`;
  });
}


function inflateRightSummary() {
    const shippingFee = 9.99
    const taxPercentage = 13;
    let mainContainer = document.getElementById("mainContainer");

    let subTotal = 0;
    let taxAmount = 0;
    let total = 0;
  
    if (mainContainer == undefined) {
      return;
    }
  
    cartItemList.forEach((i) => {
      let product = shoppingCartProducts.filter(
        (p) => p.productId == i.productId
      )[0];
  
      if (product != undefined) {
        //TODO: implement this

        let itemContainerDiv = document.createElement("div");
        let itemImg = document.createElement("img");
        let itemBodyDiv = document.createElement("div");
        let itemTextDiv = document.createElement("div");
        let itemInfoDiv = document.createElement("div");
        let itemSizeDiv = document.createElement("div");
        let itemPriceDiv = document.createElement("div");
        let itemQtyDiv = document.createElement("div");
        let itemQtyChildDiv = document.createElement("div");
        let dividerHr = document.createElement("hr");

        //Main Div
        itemContainerDiv.setAttribute("class", "d-flex cont");
        //Image
        itemImg.setAttribute("style", "object-fit:contain;height: 100px; width:100px;");
        itemImg.setAttribute("src", `data:image/png;base64,${product.picture}`);
        //Body
        itemBodyDiv.setAttribute("class", "flex-column col-div cont text-truncate");
        //Name
        itemTextDiv.setAttribute("class", "m-bottom cont");
        itemTextDiv.innerText = product.name;
        itemBodyDiv.appendChild(itemTextDiv);
        //Info
        itemInfoDiv.setAttribute("class", "d-flex m-bottom rel cont");
        itemInfoDiv.innerText = 'Size: ';
        //Size
        itemSizeDiv.setAttribute("class", "font-weight-bold");
        itemSizeDiv.setAttribute("style", "margin-left: 10px;");
        itemSizeDiv.innerText = i.size;
        itemInfoDiv.appendChild(itemSizeDiv);

        //Amount
        let total = Number(i.quantity) * product.price;
        subTotal += total; //Acumulate total

        itemPriceDiv.setAttribute("class", "font-weight-bold item-price right-position");
        itemPriceDiv.innerText = `C${formatter.format(total)}`;
        itemInfoDiv.appendChild(itemPriceDiv);

        //Quantity
        itemQtyDiv.setAttribute("class", "d-flex cont");
        itemQtyDiv.innerText = 'Qt';

        itemQtyChildDiv.setAttribute("class", "font-weight-bold");
        itemQtyChildDiv.setAttribute("style", "margin-left: 10px;");
        itemQtyChildDiv.innerText = i.quantity;

        itemQtyDiv.appendChild(itemQtyChildDiv);
        
        itemBodyDiv.appendChild(itemInfoDiv);
        itemBodyDiv.appendChild(itemQtyDiv);

        itemContainerDiv.appendChild(itemImg);
        itemContainerDiv.appendChild(itemBodyDiv);

        mainContainer.appendChild(itemContainerDiv);
        mainContainer.appendChild(dividerHr);
  
      }
    });
  
     //Calculate taxes
     taxAmount = subTotal * ( taxPercentage / 100);
     //Total
     total = (subTotal + taxPercentage + shippingFee);

     taxAmountDiv.innerText = `C${formatter.format(taxAmount)}`;
     shippingFeeDiv.innerText = `C${formatter.format(shippingFee)}`;
     totalDiv.innerText = `C${formatter.format(total)}`;
    
  }

  function saveOrder() {
    console.log(cartItemList);
    console.log(shoppingCartProducts);

    const shippingFee = 9.99
    const taxPercentage = 13;

    let dateTime = getDate();
    let orderId = Math.floor(Math.random() * 999999)
                    .toString()
                    .padStart(6,'0');
    let items = [];
    
    let subTotal = 0;
    let taxAmount = 0;
    let total = 0;

    cartItemList.forEach((i) => {
        let product = shoppingCartProducts.filter(
            (p) => p.productId == i.productId
          )[0];
            
          let totalItem = 0;
          if (product != undefined) {
            totalItem = Number(i.quantity) * product.price;
            items.push({
                productId: i.productId,
                name: product.name,
                quantity: i.quantity,
                size: i.size,
                price: product.price,
                subtotal: totalItem,
            });

            subTotal += totalItem;
          }
    });
    //Calculate taxes
    taxAmount = subTotal * ( taxPercentage / 100);
    //Total
    total = (subTotal + taxPercentage + shippingFee);

    if (items.length > 0){
        
        const order = {

            orderId: orderId,
            dateTime: dateTime,
            userId: userAuth.uid,
            fullName: fnameInput.value,
            email: emailInput.value,
            address: addressInput.value,
            state: stateInput.value,
            country: countryInput.value,
            zip: zipInput.value,
    
            cardName: cardNameInput.value,
            cardNumber: cardNumberInput.value,
            cardExpDate: cardDateInput.value,
            cardCVV: cvvInput.value,

            subTotal: subTotal,
            tax: taxAmount,
            shippingFee: shippingFee,
            total:  total,

            status: 'PENDING',

            items: items,
        }

        console.log("- ORDER -");
        console.log('Order Id: ' + orderId);
        console.log(order);

        let newOrderKey = firebase.database().ref().child('order').push().key;
        firebase
        .database()
        .ref(`order/${newOrderKey}`)
        .set(order)
        .then(() => {
            console.log(`Order created - ${newOrderKey}`)
            //Clear cart (cookie)
            setCookie("itemIndex", '', 10);
            //Redirect to index
            window.location.href = 'index.html';
        })

    }
    
}