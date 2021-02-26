let categories = [];
let urlParams = new URLSearchParams(window.location.search);

let paramClass;
let paramCategory;
let paramPrductName;
let paramProductId;
let type;

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
      cl.dropdown.appendChild(li);
    });
  });
}


function fillLeftPanel() {
  let classification;
  let leftPanelTitle = document.getElementById("leftPanelTitle");
  let leftPanelList = document.getElementById("leftPanelList");
  let title;

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

    a.innerText = ct.name;
    a.setAttribute("class", "list-group-item");
    a.setAttribute(
      "href",
      `index.html?classification=${classification}&category=${ct.id}`
    );

    leftPanelList.appendChild(a);
  });
}

function fillBanners(){
  //<img class="d-block img-fluid" src="media/banners/women-banner-1.jpg" alt="First slide"></img>
    let div1 = document.getElementById("bannerFirstImg");
    let div2 = document.getElementById("bannerSecondImg");
    let div3 = document.getElementById("bannerThirdImg");

    if(type != undefined){
      let image1 = document.createElement("img");
      image1.setAttribute("class", "d-block img-fluid");
      image1.setAttribute(
        "src",
        `media/banners/${type}/1.jpg`
      );
      image1.setAttribute("alt", "First Image");

      let image2 = document.createElement("img");
      image2.setAttribute("class", "d-block img-fluid");
      image2.setAttribute(
        "src",
        `media/banners/${type}/2.jpg`
      );
      image2.setAttribute("alt", "Second Image");

      let image3 = document.createElement("img");
      image3.setAttribute("class", "d-block img-fluid");
      image3.setAttribute(
        "src",
        `media/banners/${type}/3.jpg`
      );
      image3.setAttribute("alt", "Third Image");

      let divider = document.createElement("hr");
      let div4divider = document.getElementById("divider");

      div1.appendChild(image1);
      div2.appendChild(image2);
      div3.appendChild(image3);
      div4divider.appendChild(divider);
    }


}

function searchProduct() {
  let productNameText = document.getElementById("productNameText");

  if (productNameText.value != "") {
    window.location.href = "index.html?productname=" + productNameText.value;
  }

  return false;
}
