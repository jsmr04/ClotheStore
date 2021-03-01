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
let cardYearInput = document.getElementById("expyear");
let cvvInput = document.getElementById("cvv");

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
    let mainContainer = document.getElementById("mainContainer");
  
    if (mainContainer == undefined) {
      return;
    }
  
    cartItemList.forEach((i) => {
      let product = shoppingCartProducts.filter(
        (p) => p.productId == i.productId
      )[0];
  
      if (product != undefined) {
        //TODO: implement this

        // let itemContainerDiv = document.createElement("div");
        // let itemItemDiv = document.createElement("div");
        // let itemImgDiv = document.createElement("div");
        // let itemImg = document.createElement("img");
  
        // let itemBodyDiv = document.createElement("div");
        // let itemTextDiv = document.createElement("div");
  
        // let itemSizeDiv = document.createElement("div");
  
        // let itemPriceDiv = document.createElement("div");
  
        // let itemQtyDiv = document.createElement("div");
        // let itemQtyChildDiv = document.createElement("div");
        // let qtyInput = document.createElement("input");
  
        // let deviderDiv = document.createElement("div");
        // let amountDiv = document.createElement("div");
  
        // let deleteA = document.createElement("a");
  
        // //Main Div
        // itemContainerDiv.setAttribute("class", "container-cart");
        // itemContainerDiv.setAttribute("id", `item-${i.key}`);
        // itemItemDiv.setAttribute("class", "item-cel d-flex");
  
        // //Image
        // itemImgDiv.setAttribute("class", "item-img mr-3 corner-cel");
        // itemImg.setAttribute("class", "rounded-sm mr-3");
        // itemImg.setAttribute("style", "object-fit:contain;max-height:200px");
        // itemImg.setAttribute("src", `data:image/png;base64,${product.picture}`);
        // itemImgDiv.appendChild(itemImg);
  
        // //Body
        // //text
        // itemBodyDiv.setAttribute("class", "flex-column mr-3 middle-cel");
        // itemTextDiv.setAttribute("class", "text-truncate m-bottom");
        // itemTextDiv.innerHTML = `<b>${product.name}</b>`;
        // itemBodyDiv.appendChild(itemTextDiv);
  
        // //size
        // itemSizeDiv.setAttribute("class", "m-bottom");
        // itemSizeDiv.innerHTML = `Size: <b id="item-size">${i.size}</b>`;
        // itemBodyDiv.appendChild(itemSizeDiv);
  
        // //Price
        // itemPriceDiv.setAttribute("class", "m-bottom");
        // itemPriceDiv.innerHTML = `Price: <b id="item-size">${formatter.format(
        //   product.price
        // )}</b>`;
        // itemBodyDiv.appendChild(itemPriceDiv);
  
        // //Quantity
        // itemQtyDiv.setAttribute("class", "d-flex");
  
        // itemQtyChildDiv.setAttribute(
        //   "style",
        //   "text-align: center; margin-top:5px; margin-right: 5px;"
        // );
        // itemQtyChildDiv.innerText = "Qt:";
        // itemQtyDiv.appendChild(itemQtyChildDiv);
  
        // qtyInput.setAttribute("type", "number");
        // qtyInput.setAttribute("id", `quantity-${i.key}`);
        // qtyInput.setAttribute("class", "form-control item-select");
        // qtyInput.setAttribute("min", "1");
        // qtyInput.setAttribute("max", "99");
        // qtyInput.setAttribute("value", i.quantity);
        // qtyInput.setAttribute("onchange", `updateQuantity(${i.key}, 'quantity-${i.key}', 'amount-${i.key}')`);
        // itemQtyDiv.appendChild(qtyInput);
  
        // deviderDiv.setAttribute("class", "divider-vertical");
  
        // //Price
        // let total = Number(i.quantity) * product.price;
        // //totalFooter += total; //Acumulate total
  
        // amountDiv.setAttribute("class", "ml-3 item-price corner-cel mr-3");
        // amountDiv.setAttribute("id", `amount-${i.key}`);
        // amountDiv.innerHTML = `<b>C${formatter.format(total)}</b>`;
  
        // //Delete
        // deleteA.setAttribute("class", "item-icon-delete mr-3");
        // deleteA.innerHTML = `<i onclick = "removeItem(${i.key}, 'item-${i.key}')" class="fas fa-trash"></i>`;
  
        // itemBodyDiv.appendChild(itemQtyDiv);
  
        // itemItemDiv.appendChild(itemImgDiv);
        // itemItemDiv.appendChild(itemBodyDiv);
        // itemItemDiv.appendChild(deviderDiv);
        // itemItemDiv.appendChild(amountDiv);
        // itemItemDiv.appendChild(deleteA);
  
        // itemContainerDiv.appendChild(itemItemDiv);
        // mainContainer.appendChild(itemContainerDiv);
      }
    });
  
    //calculateTotals() ;
    
  }

  function saveOrder() {

    console.log('HERE 1');
    console.log(cartItemList);

    const shippingFee = 9.99
    const taxPercentage = 13;

    let dateTime = getDate();
    let items = [];
    
    let subTotal = 0;
    let taxAmount = 0;
    let total = 0;

    cartItemList.forEach((i) => {
        let product = shoppingCartProducts.filter(
            (p) => p.productId == i.productId
          )[0];
            
          let totalItem = Number(i.quantity) * product.price;

          if (product != undefined) {
            items.push({
                productId: i.productId,
                quantity: i.quantity,
                size: i.size,
                price: p.price,
                subtotal: totalItem,
            });

            subTotal += totalItem;
          }
    });
    //Calculate taxes
    taxAmount = subTotal * ( taxPercentage / 100);
    total = (subTotal + taxPercentage + shippingFee);

    if (items.length > 0){
        const order = {
            user: userAuth.uid,
            fullName: fnameInput.value,
            email: addressInput.value,
            state: stateInput.value,
            country: countryInput.value,
            zip: zipInput.value,
    
            cardName: cardNameInput.value,
            cardNumber: cardNumberInput.value,
            cardMonth: cardMonthInput.value,
            cardYear: cardYearInput.value,
            cardCVV: cvvInput.value,

            dateTime: dateTime,
            subTotal: subTotal,
            tax: taxAmount,
            total:  total,

            items: items,
        }

        console.log(order);

    }
    
}