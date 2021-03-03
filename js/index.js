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

function handleForm(event) {
  event.preventDefault();
}
form.addEventListener("submit", handleForm);

//Getting products
getProducts();

function getProducts() {
  const productContainer = document.getElementById("productContainer");
  const productRef = firebase.database().ref("product/");

  //Show loader
  showLoader();

  productRef
    .orderByChild("active")
    .equalTo(true)
    .once("value", function (snapshot) {
      //productContainer.innerHTML = "";
      products = [];
      snapshot.forEach(function (childSnapshot) {
        let storage = firebase.storage();
        let storageRef = storage.ref("pictures");
        let childKey = childSnapshot.key;
        let childData = childSnapshot.val();
        let cont = true;

        //Filters
        if (paramClass != undefined) {
          if (
            childData["classification"].toUpperCase() !=
            paramClass.toUpperCase()
          ) {
            cont = false;
          }
        }

        if (paramCategory != undefined) {
          console.log(
            `Cat: ${childData["category"].toString()}, ${paramClass}`
          );
          if (childData["category"].toString() != paramCategory) {
            cont = false;
          }
        }

        if (paramPrductName != undefined) {
          if (
            !childData["name"]
              .toUpperCase()
              .includes(paramPrductName.toUpperCase())
          ) {
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
              //Getting image
              storageRef
                .child(childData.pictures[0].storagePath)
                .getDownloadURL()
                .then(function (url) {
                  image.setAttribute("src",url);
                });
            }
          }

          //Card body
          cardBodyDiv.setAttribute("class", "card-body");

          //Title
          titleH4.setAttribute("class", "card-title");

          //Creating HREF
          let hrefString =
            urlParams.toString() == ""
              ? `item.html?productId=${childData["id"]}`
              : `item.html?${urlParams.toString()}&productId=${
                  childData["id"]
                }`;

          titleA.setAttribute("href", hrefString);
          titleA.innerText = childData["name"];
          titleH4.appendChild(titleA);
          cardBodyDiv.appendChild(titleH4);

          //Price
          priceH5.innerText = `C${formatter.format(childData.price)}`;
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

      hideLoader();
      fillBanners();
    });
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
