let categories = [];
let urlParams = new URLSearchParams(window.location.search);

let paramClass;
let paramCategory;
let paramPrductName;

class Product {
  constructor(
    id,
    name,
    description,
    category,
    price,
    stock,
    dateTime,
    active,
    pictures,
    classification,
    size
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.price = price;
    this.stock = stock;
    this.dateTime = dateTime;
    this.active = active;
    this.pictures = pictures;
    this.classification = classification;
    this.size = size;
  }
}

let products = [];
let pictures = [];
let productIndex = -1;

//Prevent page reload
let form = document.getElementById("form-search");

function handleForm(event) { event.preventDefault(); }
form.addEventListener('submit', handleForm);

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

getCategories();
getProducts();

function getCategories() {
  const categoryRef = firebase.database().ref("category/");
  categoryRef.on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      let childData = childSnapshot.val();
      categories.push(
        {  id:childData["id"],
           name: childData["categoryName"]
        }
        );
    });

    fillClassificationDropdown();
    fillLeftPanel();
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
      cl.dropdown.appendChild(li);
    });
  });
}

function fillLeftPanel() {
  let classification;
  let leftPanelTitle = document.getElementById("leftPanelTitle");
  let leftPanelList = document.getElementById("leftPanelList");
  let title;

  //Women is default
  classification = paramClass == undefined ? "women" : paramClass;
  console.log(classification);
  switch (classification) {
    case "women":
      title = "Women Clothes";
      break;
    case "men":
      title = "Men Clothes";
      break;
    case "kids":
      title = "Kids Clothes";
      break;
  }

  //Panel title
  leftPanelTitle.innerText = title;

  //Items
  categories.forEach((ct) => {
    let a = document.createElement("a");

    a.innerText = ct.name;
    a.setAttribute("class", "list-group-item");
    a.setAttribute(
      "href",
      `index.html?classification=${classification}&category=${ct.id}`
    );

    leftPanelList.appendChild(a);
  });
}

function getProducts() {
  const productContainer = document.getElementById("productContainer");
  const productRef = firebase.database().ref("product/");

  productRef
    .orderByChild("active")
    .equalTo(true)
    .once("value", function (snapshot) {
      //productContainer.innerHTML = "";
      products = [];
      snapshot.forEach(function (childSnapshot) {
        let childKey = childSnapshot.key;
        let childData = childSnapshot.val();
        let cont = true;

        //Filters
        if (paramClass != undefined) {
          if (childData["classification"].toUpperCase() != paramClass.toUpperCase()) {
            cont = false;
          }
        }

        if (paramCategory != undefined) {
          console.log(`Cat: ${childData["category"].toString()}, ${paramClass}`)
          if (childData["category"].toString() != paramCategory) {
            cont = false;
          }
        }

        if (paramPrductName != undefined) {
            if (!childData["name"].toUpperCase().includes(paramPrductName.toUpperCase())){
                cont = false;
            }
        }

        if (cont) {
          let mainDiv = document.createElement("div");
          let cardDiv = document.createElement("div");
          let image = document.createElement("img");

          let cardBodyDiv = document.createElement("div");
          let titleH4 = document.createElement("h4");
          let titleA = document.createElement("a");
          let priceH5 = document.createElement("h5");
          let descP = document.createElement("p");

          let cardFooterDiv = document.createElement("div");
          let rateSmall = document.createElement("small");

          //Main div
          mainDiv.setAttribute("class", "col-lg-4 col-md-6 mb-4");
          //Card
          cardDiv.setAttribute("class", "card h-100");
          //cardDiv.setAttribute('style','max-height:250px');

          //Image width=180 height=180
          image.setAttribute("class", "card-img-top");
          image.setAttribute("src", "http://placehold.it/700x400");
          image.setAttribute("style", "object-fit:cover;max-height:240px");

          //width=180 height=180
          if (childData["pictures"] != undefined) {
            console.log(childData["pictures"]);
            if (childData["pictures"].length > 0) {
              image.setAttribute(
                "src",
                `data:image/png;base64,${childData["pictures"][0].base64String}`
              );
            }
          }

          //Card body
          cardBodyDiv.setAttribute("class", "card-body");

          //Title
          titleH4.setAttribute("class", "card-title");
          //TODO: Add reference
          titleA.setAttribute("href", "#");
          titleA.innerText = childData["name"];
          titleH4.appendChild(titleA);
          cardBodyDiv.appendChild(titleH4);

          //Price
          priceH5.innerText = `$${childData["price"]}`;
          cardBodyDiv.appendChild(priceH5);

          //Description
          descP.innerText = childData["description"];
          cardBodyDiv.appendChild(descP);

          //Footer
          cardFooterDiv.setAttribute("class", "card-footer");
          rateSmall.setAttribute("class", "text-muted");
          rateSmall.innerHTML = "&#9733; &#9733; &#9733; &#9733; &#9734;";
          cardFooterDiv.appendChild(rateSmall);

          cardDiv.appendChild(image);
          cardDiv.appendChild(cardBodyDiv);
          cardDiv.appendChild(cardFooterDiv);
          mainDiv.appendChild(cardDiv);
          productContainer.appendChild(mainDiv);
        }

      });
    });
}

function searchProduct(){
    let productNameText = document.getElementById('productNameText');

    if (productNameText.value != ''){
        window.location.href = "index.html?productname=" + productNameText.value ;
    }
    
    return false;
}