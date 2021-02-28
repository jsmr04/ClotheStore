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

//Getting products
getProducts();

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

          //Creating HREF
          let hrefString = urlParams.toString() == '' 
                ? `item.html?productId=${childData["id"]}`
                : `item.html?${urlParams.toString()}&productId=${childData["id"]}` 

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
    });
}
