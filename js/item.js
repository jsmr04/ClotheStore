let productId;
let itemSizeSelected;

let itemDesc = document.getElementById("item-desc");
let itemPrice = document.getElementById("item-price");
let itemDesciption = document.getElementById("item-description");
let buyModalTitle = document.getElementById("buyModalTitle");
let itemQuantity = document.getElementById("itemQuantity");
let sizeXS = document.getElementById("sizeXS");
let sizeS = document.getElementById("sizeS");
let sizeM = document.getElementById("sizeM");
let sizeL = document.getElementById("sizeL");
let sizeXL = document.getElementById("sizeXL");
let itemPictures = document.getElementById("itemPictures");

getProduct();
function getProduct() {
  if (paramProductId != undefined) {
    const productRef = firebase.database().ref("product/");

    productRef
      .orderByKey()
      .equalTo(paramProductId)
      .once("value", function (snapshot) {
        //productContainer.innerHTML = "";
        products = [];
        snapshot.forEach(function (childSnapshot) {
          let childKey = childSnapshot.key;
          let childData = childSnapshot.val();

          productId = childKey;

          //Checkout Modal Dialog title
          buyModalTitle.innerText = childData["name"];

          itemDesc.innerText = childData["name"];
          itemPrice.innerText = `C$${childData["price"]}`;
          itemDesciption.innerText = childData["description"];

          //Size - desactivate
          if (childData["size"] != undefined) {
            if (childData["size"].filter((s) => s == "XS").length == 0) {
              sizeXS.setAttribute("style", "pointer-events:none;");
            }

            if (childData["size"].filter((s) => s == "S").length == 0) {
              sizeS.setAttribute("style", "pointer-events:none;");
            }

            if (childData["size"].filter((s) => s == "M").length == 0) {
              sizeM.setAttribute("style", "pointer-events:none;");
            }

            if (childData["size"].filter((s) => s == "L").length == 0) {
              sizeL.setAttribute("style", "pointer-events:none;");
            }

            if (childData["size"].filter((s) => s == "XL").length == 0) {
              sizeXL.setAttribute("style", "pointer-events:none;");
            }
          }

          //Pictures
          let firstItem = true;
          console.log(childData["pictures"]);
          if (childData["pictures"] != undefined) {
            console.log(childData["pictures"]);
            childData["pictures"].forEach((p) => {
              console.log(p.name);
              let carouselDiv = document.createElement("div");
              let pictureImg = document.createElement("img");

              carouselDiv.setAttribute(
                "class",
                `carousel-item ${firstItem ? "active" : ""}`
              );
              firstItem = false; //Only the first item has to be active

              pictureImg.setAttribute("class", "d-block img-fluid");
              pictureImg.setAttribute(
                "style",
                "object-fit:contain;max-height:240px"
              );

              pictureImg.setAttribute(
                "src",
                `data:image/png;base64,${p.base64String}`
              );

              carouselDiv.appendChild(pictureImg);
              itemPictures.appendChild(carouselDiv);
            });
          }
          //console.log(childData);
        });
      });
  }
}

function addToCart(goToCheckout) {
  if (productId != undefined && itemSizeSelected != undefined && itemQuantity.value != '') {
    //ITEM KEY
    let itemIndex = getCookie("itemIndex");
    let lastKey;

    if (itemIndex != "") {
      let arrItemKey = itemIndex.split("|");
      if (arrItemKey != undefined) {
        lastKey = arrItemKey[arrItemKey.length - 1];
      }
    }

    if (lastKey != undefined) {
      itemIndex = `${itemIndex}|${++lastKey}`; //Next key
    } else {
      itemIndex = 1; //First key
      lastKey = 1;
    }
    //Set cookie
    setCookie("itemIndex", itemIndex, 10);

    //VALUE
    let itemValues = `${lastKey}|${productId}|${itemSizeSelected}|${itemQuantity.value}|`;
    //Set cookie
    setCookie(lastKey, itemValues, 10);

    console.log("new cookie added: " + getCookie(lastKey));

    if (goToCheckout){
        window.location.href = "checkout.html";
    }else{
        window.location.href = "index.html";
    }
  }
}

function selectSize(sizeSelected) {
  let buyItem = document.getElementById('buyItem');
  itemSizeSelected = sizeSelected;
  console.log(itemSizeSelected);

  buyItem.setAttribute('class', 'btn btn-1 bg-checkout-warning')
  buyItem.setAttribute('style', '')

}

