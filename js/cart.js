function inflateMainShoppingCart() {
  let mainContainer = document.getElementById("mainContainer");

  if (mainContainer == undefined) {
    return;
  }

  cartItemList.forEach((i) => {
    let product = shoppingCartProducts.filter(
      (p) => p.productId == i.productId
    )[0];

    if (product != undefined) {
      let itemContainerDiv = document.createElement("div");
      let itemItemDiv = document.createElement("div");
      let itemImgDiv = document.createElement("div");
      let itemImg = document.createElement("img");

      let itemBodyDiv = document.createElement("div");
      let itemTextDiv = document.createElement("div");

      let itemSizeDiv = document.createElement("div");

      let itemPriceDiv = document.createElement("div");

      let itemQtyDiv = document.createElement("div");
      let itemQtyChildDiv = document.createElement("div");
      let qtyInput = document.createElement("input");

      let deviderDiv = document.createElement("div");
      let amountDiv = document.createElement("div");

      let deleteA = document.createElement("a");

      //Main Div
      itemContainerDiv.setAttribute("class", "container-cart");
      itemContainerDiv.setAttribute("id", `item-${i.key}`);
      itemItemDiv.setAttribute("class", "item-cel d-flex");

      //Image
      itemImgDiv.setAttribute("class", "item-img mr-3 corner-cel");
      itemImg.setAttribute("class", "rounded-sm mr-3");
      itemImg.setAttribute("style", "object-fit:contain;max-height:200px");
      itemImg.setAttribute("src", product.picture.url);
      itemImgDiv.appendChild(itemImg);

      //Body
      //text
      itemBodyDiv.setAttribute("class", "flex-column mr-3 middle-cel");
      itemTextDiv.setAttribute("class", "text-truncate m-bottom");
      itemTextDiv.innerHTML = `<b>${product.name}</b>`;
      itemBodyDiv.appendChild(itemTextDiv);

      //size
      itemSizeDiv.setAttribute("class", "m-bottom");
      itemSizeDiv.innerHTML = `Size: <b id="item-size">${i.size}</b>`;
      itemBodyDiv.appendChild(itemSizeDiv);

      //Price
      itemPriceDiv.setAttribute("class", "m-bottom");
      itemPriceDiv.innerHTML = `Price: <b id="item-size">${formatter.format(
        product.price
      )}</b>`;
      itemBodyDiv.appendChild(itemPriceDiv);

      //Quantity
      itemQtyDiv.setAttribute("class", "d-flex");

      itemQtyChildDiv.setAttribute(
        "style",
        "text-align: center; margin-top:5px; margin-right: 5px;"
      );
      itemQtyChildDiv.innerText = "Qt:";
      itemQtyDiv.appendChild(itemQtyChildDiv);

      qtyInput.setAttribute("type", "number");
      qtyInput.setAttribute("id", `quantity-${i.key}`);
      qtyInput.setAttribute("class", "form-control item-select");
      qtyInput.setAttribute("min", "1");
      qtyInput.setAttribute("max", "99");
      qtyInput.setAttribute("value", i.quantity);
      qtyInput.setAttribute("onchange", `updateQuantity(${i.key}, 'quantity-${i.key}', 'amount-${i.key}')`);
      itemQtyDiv.appendChild(qtyInput);

      deviderDiv.setAttribute("class", "divider-vertical");

      //Price
      let total = Number(i.quantity) * product.price;
      //totalFooter += total; //Acumulate total

      amountDiv.setAttribute("class", "ml-3 item-price corner-cel mr-3");
      amountDiv.setAttribute("id", `amount-${i.key}`);
      amountDiv.innerHTML = `<b>C${formatter.format(total)}</b>`;

      //Delete
      deleteA.setAttribute("class", "item-icon-delete mr-3");
      deleteA.innerHTML = `<i onclick = "removeItem(${i.key}, 'item-${i.key}')" class="fas fa-trash"></i>`;

      itemBodyDiv.appendChild(itemQtyDiv);

      itemItemDiv.appendChild(itemImgDiv);
      itemItemDiv.appendChild(itemBodyDiv);
      itemItemDiv.appendChild(deviderDiv);
      itemItemDiv.appendChild(amountDiv);
      itemItemDiv.appendChild(deleteA);

      itemContainerDiv.appendChild(itemItemDiv);
      mainContainer.appendChild(itemContainerDiv);
    }
  });

  calculateTotals() ;
  
}

function removeItem(productKey, divId) {
  console.log(productKey);
  console.log(divId);

  let itemDiv = document.getElementById(divId);
  let cartItems = document.getElementById("cartItems");

  //Removing from array
  cartItemList = cartItemList.filter((x) => x.key != productKey);
  console.log(cartItemList);

  //Creating new index
  let newItemIndex = cartItemList
    .filter((x) => x.key != productKey) //Exclude removed item
    .map((x) => x.key + "|") //Add pipe
    .toString() //Convert to String
    .replaceAll(",", "") //remove comma
    .replace(/.$/, ""); //Remove last pipe - nice, isn't it? :D
  console.log(newItemIndex);

  //Set new index
  setCookie("itemIndex", newItemIndex, 10);

  //Hide item
  if (itemDiv != undefined) {
    itemDiv.setAttribute("hidden", "true");
  }

  //Update cart items number
  cartItems.innerText = cartItemList.length;
 
  //Fill top shopping cart
  inflateShoppingCart();

  //Calculate totals
  calculateTotals() ;
}

function calculateTotals() {
  const shippingFee = 9.99;
  const taxPercentage = 13;
  let taxAmount = 0;

  let totalFooter = 0;

  
  let subtotalAmount = document.getElementById("subtotalAmount");
  let summarySubtotal = document.getElementById("summarySubtotal");
  let summaryShippingFee = document.getElementById("summaryShippingFee");
  let summaryTaxes = document.getElementById("summaryTaxes");
  let summaryTotal = document.getElementById("summaryTotal");
  let cartItemCounter = document.getElementById("cartItemCounter");

  cartItemList.forEach((i) => {
    let product = shoppingCartProducts.filter(
        (p) => p.productId == i.productId
      )[0];

      if (product != undefined) {
        let total = Number(i.quantity) * product.price;
        totalFooter += total; //Acumulate total
      }

  })

  subtotalAmount.innerText = `C${formatter.format(totalFooter)}`;
  //Order Summary
  taxtAmount = totalFooter * ( taxPercentage / 100);

  summarySubtotal.innerText = `C${formatter.format(totalFooter)}`;
  summaryShippingFee.innerText = `C${formatter.format(shippingFee)}`;
  summaryTaxes.innerText = `C${formatter.format(taxtAmount)}`;
  summaryTotal.innerText = `C${formatter.format(totalFooter + shippingFee + taxtAmount)}`;
  cartItemCounter.innerText = `SubTotal (${cartItemList.length} ${cartItemList.length == 1? 'item':'items'})`;
}

function updateQuantity(productKey, quantityId, amountId){
    let quantityInput = document.getElementById(quantityId);
    let amountDiv = document.getElementById(amountId);

    let cartItem = cartItemList.filter(
        (i) => i.key == productKey
      )[0];

      console.log(cartItem)

    if (cartItem != undefined){
        let product = shoppingCartProducts.filter(
            (p) => p.productId == cartItem.productId
          )[0];
            
        if (product != undefined){
            //Update quantity 
            cartItem.quantity = quantityInput.value;
            //calculate amount
            amountDiv.innerHTML = `<b>C${formatter.format(cartItem.quantity * product.price)}</b>`;

            //update cookie
            //VALUE
            let itemValues = `${cartItem.key}|${cartItem.productId}|${cartItem.size}|${cartItem.quantity}|`;
             
            //Set cookie
            setCookie(cartItem.key, itemValues, 10);
        }
    }
    calculateTotals();
}

function goToCheckout() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        window.location.href = "checkout.html";
      } else {
        window.location.href = "pages/login.html?nextPage=checkout";
      }
    });
  }