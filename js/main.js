
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

let categories = [];
let urlParams = new URLSearchParams(window.location.search);

let paramClass;
let paramCategory;
let paramPrductName;
let paramProductId;
let type;
let cartItemList = [];

let shoppingCartProducts = [];

//Getting params
if (urlParams.has("classification")) {
  paramClass = urlParams.get("classification");
}

if (urlParams.has("category")) {
  paramCategory = urlParams.get("category");
}

if (urlParams.has("productname")) {
  paramPrductName = urlParams.get("productname");
}

if (urlParams.has("productId")) {
  paramProductId = urlParams.get("productId");
}

getCategories();
updateItemCounter();

function getCategories() {
  const categoryRef = firebase.database().ref("category/");
  categoryRef.on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      let childData = childSnapshot.val();
      categories.push({ id: childData["id"], name: childData["categoryName"] });
    });

    fillClassificationDropdown();
    fillLeftPanel();
    fillBanners();
  });
}

function fillClassificationDropdown() {
  const classArr = [
    { name: "men", dropdown: document.getElementById("menDropdownUl") },
    { name: "women", dropdown: document.getElementById("womenDropdownUl") },
    { name: "kids", dropdown: document.getElementById("kidsDropdownUl") },
  ];

  console.log(classArr);
  console.log(categories);

  classArr.forEach((cl) => {
    categories.forEach((ct) => {
      let li = document.createElement("li");
      let a = document.createElement("a");

      a.innerText = ct.name;
      a.setAttribute("class", "dropdown-item");
      a.setAttribute(
        "href",
        `index.html?classification=${cl.name}&category=${ct.id}`
      );

      li.appendChild(a);

      if (cl.dropdown != undefined) {
        cl.dropdown.appendChild(li);
      }
    });
  });
}

function fillLeftPanel() {
  let classification;
  let leftPanelTitle = document.getElementById("leftPanelTitle");
  let leftPanelList = document.getElementById("leftPanelList");
  let title;

  if (leftPanelTitle != undefined) {
    //All is default
    classification = paramClass == undefined ? "all" : paramClass;
    switch (classification) {
      case "women":
        title = "Women Clothes";
        type = "women";
        break;
      case "men":
        title = "Men Clothes";
        type = "men";
        break;
      case "kids":
        title = "Kids Clothes";
        type = "kids";
        break;
      case "all":
        title = "All Clothes";
        break;
    }

    //Panel title
    leftPanelTitle.innerText = title;

    //Items
    categories.forEach((ct) => {
      let a = document.createElement("a");
      let urlString = classification == 'all' 
      ? `index.html?category=${ct.id}` 
      : `index.html?classification=${classification}&category=${ct.id}`;

      a.innerText = ct.name;
      a.setAttribute("class", "list-group-item");
      a.setAttribute(
        "href",
        urlString
      );

      leftPanelList.appendChild(a);
    });
  }
}

function fillBanners() {
  //<img class="d-block img-fluid" src="media/banners/women-banner-1.jpg" alt="First slide"></img>
  let div1 = document.getElementById("bannerFirstImg");
  let div2 = document.getElementById("bannerSecondImg");
  let div3 = document.getElementById("bannerThirdImg");

  if (type != undefined) {
    let image1 = document.createElement("img");
    image1.setAttribute("class", "d-block img-fluid");
    image1.setAttribute("src", `media/banners/${type}/1.jpg`);
    image1.setAttribute("alt", "First Image");

    let image2 = document.createElement("img");
    image2.setAttribute("class", "d-block img-fluid");
    image2.setAttribute("src", `media/banners/${type}/2.jpg`);
    image2.setAttribute("alt", "Second Image");

    let image3 = document.createElement("img");
    image3.setAttribute("class", "d-block img-fluid");
    image3.setAttribute("src", `media/banners/${type}/3.jpg`);
    image3.setAttribute("alt", "Third Image");

    let divider = document.createElement("hr");
    let div4divider = document.getElementById("divider");

    div1.appendChild(image1);
    div2.appendChild(image2);
    div3.appendChild(image3);
    div4divider.appendChild(divider);
  }
}

function updateItemCounter() {
  let cartItems = document.getElementById("cartItems");
  if (cartItems != undefined) {
    let itemIndex = getCookie("itemIndex");

    if (itemIndex != "") {
      let itemsInCart = itemIndex.split("|");
      cartItems.innerText = itemsInCart.length;

      itemsInCart.forEach((i) => {
        let values = getCookie(i); //sending the key
        if (values != "") {
          //Getting product Id from cookie
          cartItemList.push({
            key: values.split("|")[0],
            productId: values.split("|")[1],
            size: values.split("|")[2],
            quantity: values.split("|")[3],
          });
        }
      });

      if (cartItemList.length > 0) {
        console.log(cartItemList);
        fillShoppingCart();
      }
    }
  }
}

function fillShoppingCart() {
  const productRef = firebase.database().ref("product/");

  productRef.once("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      let childKey = childSnapshot.key;
      let childData = childSnapshot.val();

      //If product exists its added into the array
      if (cartItemList.filter((i) => i.productId == childKey).length > 0) {
        let pic;
        if (childData.pictures != undefined && childData.pictures.length > 0) {
          pic = childData["pictures"][0].base64String;
        }

        shoppingCartProducts.push({
          productId: childKey,
          name: childData.name,
          picture: pic,
          price: childData.price,
        });
        console.log("shoppingCartProducts");
        console.log(shoppingCartProducts);
      }
    });
    inflateShoppingCart();
    inflateMainShoppingCart();
  });
}

function inflateShoppingCart() {
  const shippingFee = 9.99;

  let shoppingCart = document.getElementById("shoppingCart");
  let totalCart = document.getElementById("totalCart");
  let summarySubtotal = document.getElementById("summarySubtotal");
  let summaryShippingFee = document.getElementById("summaryShippingFee");
  let summaryTaxes = document.getElementById("summaryTaxes");
  let summaryTotal = document.getElementById("summaryTotal");

  let totalFooter = 0;

  cartItemList.forEach((i) => {
    let product = shoppingCartProducts.filter(
      (p) => p.productId == i.productId
    )[0];

    if (product != undefined) {
      console.log("product");
      console.log(product);
      console.log(i);

      let itemDiv = document.createElement("div");
      let itemImgDiv = document.createElement("div");
      let itemImg = document.createElement("img");
      let itemBodyDiv = document.createElement("div");
      let itemTextDiv = document.createElement("div");
      let itemPriceDiv = document.createElement("div");
      //Main div
      itemDiv.setAttribute("class", "dropdown-item d-flex align-items-center");

      //Image
      itemImgDiv.setAttribute("class", "dropdown-list-image mr-3");
      itemImg.setAttribute("class", "rounded-sm");

      itemImg.setAttribute("style", "object-fit:contain;max-height:200px");

      itemImg.setAttribute("src", `data:image/png;base64,${product.picture}`);

      //Body
      itemTextDiv.setAttribute("class", "text-truncate");
      itemTextDiv.innerText = product.name;
      itemBodyDiv.appendChild(itemTextDiv);

      let total = Number(i.quantity) * product.price;
      totalFooter += total; //Acumulate total

      itemPriceDiv.setAttribute("class", "medium");
      itemPriceDiv.innerHTML = `<b>C${formatter.format(total)}</b>`;
      itemBodyDiv.appendChild(itemPriceDiv);

      itemImgDiv.appendChild(itemImg);
      itemDiv.appendChild(itemImgDiv);
      itemDiv.appendChild(itemBodyDiv);

      shoppingCart.appendChild(itemDiv);
    }
  });

  totalCart.innerText = `C${formatter.format(totalFooter)}`;

  //Order Summary
  summarySubtotal.innerText = `C${formatter.format(totalFooter)}`;
  summaryShippingFee.innerText = `C${formatter.format(shippingFee)}`;
  summaryTaxes.innerText = `C${formatter.format(0)}`;
  summaryTotal.innerText = `C${formatter.format(totalFooter + shippingFee)}`;

}

function searchProduct() {
  let productNameText = document.getElementById("productNameText");

  if (productNameText.value != "") {
    window.location.href = "index.html?productname=" + productNameText.value;
  }

  return false;
}

function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
