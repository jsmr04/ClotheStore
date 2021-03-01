let urlPars = new URLSearchParams(window.location.search);
let urlOrderKey;

if(urlPars.has("orderKey")){
    urlOrderKey = urlPars.get("orderKey");
    inflateOrderConfirmation();
}

console.log(urlOrderKey);

function inflateOrderConfirmation(){
    const ordersRef = firebase.database().ref("order/");

    let orderId = document.getElementById("orderId");
    let fname = document.getElementById("fname");
    let address = document.getElementById("address");
    let state = document.getElementById("state");
    let zip = document.getElementById("zip");

    let itemsDiv = document.getElementById("items");  

    let tax = document.getElementById("tax");
    let delivery = document.getElementById("delivery");
    let total = document.getElementById("total");

    ordersRef
      .orderByKey()
      .equalTo(urlOrderKey)
      .once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            //let childKey = childSnapshot.key;
            let childData = childSnapshot.val();

            console.log(childData)

            orderId.innerHTML = childData["orderId"];
            fname.innerHTML = childData["fullName"];
            address.innerHTML = childData["address"];
            state.innerHTML = childData["state"];
            zip.innerHTML = childData["zip"];
            
            tax.innerHTML = "C$" + formatter.format(childData["tax"]);
            delivery.innerHTML = "C$" + formatter.format(childData["shippingFee"]);
            total.innerHTML = "C$" + formatter.format(childData["total"]);

            let items = childData["items"];
            console.log(items);

            items.forEach((i) => {
                //Item number
                let divItemNum = document.createElement("div");
                let divItemNum1 = document.createElement("div");
                let divItemNum2 = document.createElement("div");
                divItemNum.setAttribute("class", "d-flex cont")
                divItemNum1.innerHTML = "#: "
                divItemNum2.setAttribute("class","m-left cont font-weight-bold");
                divItemNum2.innerHTML = i.productId;

                divItemNum.appendChild(divItemNum1);
                divItemNum.appendChild(divItemNum2);

                //Item Description
                let divItemDesc = document.createElement("div");
                let divItemDesc1 = document.createElement("div");
                let divItemDesc2 = document.createElement("div");
                divItemDesc.setAttribute("class", "d-flex cont ");
                divItemDesc1.innerHTML = "Descrip: ";
                divItemDesc2.setAttribute("class","m-left cont font-weight-bold");
                divItemDesc2.innerHTML = i.name;

                divItemDesc.appendChild(divItemDesc1);
                divItemDesc.appendChild(divItemDesc2);

                //Item Size
                let divItemSize = document.createElement("div");
                let divItemSize1 = document.createElement("div");
                let divItemSize2 = document.createElement("div");
                divItemSize.setAttribute("class", "d-flex cont");
                divItemSize1.innerHTML = "Size: ";
                divItemSize2.setAttribute("class","m-left cont font-weight-bold");
                divItemSize2.innerHTML = i.size;

                divItemSize.appendChild(divItemSize1);
                divItemSize.appendChild(divItemSize2);

                //Item Quantity
                let divItemQt = document.createElement("div");
                let divItemQt1 = document.createElement("div");
                let divItemQt2 = document.createElement("div");
                let divItemPrice = document.createElement("div");

                divItemQt.setAttribute("class", "d-flex cont");
                divItemQt1.innerHTML = "Qt: ";
                divItemQt2.setAttribute("class","m-left cont font-weight-bold");
                divItemQt2.innerHTML = i.quantity;
                divItemPrice.setAttribute("class", "cont font-weight-bold text-dark");
                divItemPrice.setAttribute("style", "text-align: right;");
                divItemPrice.innerHTML = "C$" + formatter.format(i.subtotal);

                divItemQt.appendChild(divItemQt1);
                divItemQt.appendChild(divItemQt2);
                divItemQt.appendChild(divItemPrice);

                let hr = document.createElement("hr");
                itemsDiv.appendChild(divItemNum);
                itemsDiv.appendChild(divItemDesc);
                itemsDiv.appendChild(divItemSize);
                itemsDiv.appendChild(divItemQt);
                itemsDiv.appendChild(hr);
            });
        });
    });
}