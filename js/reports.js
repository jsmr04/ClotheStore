let categories = [];
let categoryProducts = [];
let salesCategory = [];
let salesProduct = [];
let products = [];

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

function getSalesByCategory() {
  getCategories();
}

function getCategories() {
  const categoryRef = firebase.database().ref("category/");
  //Getting categories
  categoryRef.once("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      let childKey = childSnapshot.key;
      let childData = childSnapshot.val();
      categories.push({
        id: childData.id,
        name: childData.categoryName,
      });
      
    });

    console.log("categories");
    console.log(categories);
    getProducts();
  });
}

function getProducts() {
  const productRef = firebase.database().ref("product/");
  //Getting products by categories
  productRef.once("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      let childData = childSnapshot.val();
      let childKey = childSnapshot.key;
      
      let categoryId = childSnapshot.val().category;
      let category = categories.filter(c => c.id == categoryId)[0];

      if (category != undefined) {
        console.log(category);
        categoryProducts.push({
            productId:  childKey,
            categoryId: categoryId,
            categoryName: category.name
        }
        );
      }
    });

    console.log(categoryProducts);
    getSales();
  });
}

function getSales() {
  const orderRef = firebase.database().ref("order/");
  orderRef
    .orderByChild("status")
    .equalTo("COMPLETED")
    .on("value", function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        let childKey = childSnapshot.key;
        let childData = childSnapshot.val();
        let items = [];

        items = childData.items;

        items.forEach((i) => {
          let categoryProduct = categoryProducts.filter(
            (cp) => cp.productId == i.productId
          )[0];
          if (categoryProduct != undefined) {
            salesCategory.push({
              categoryId: categoryProduct.categoryId,
              categoryName: categoryProduct.categoryName,
              amount: i.subtotal,
            });
          }
        });
      });

      //console.log("SALES BY CATEGORY");
      console.log(salesCategory);
      groupAndShowSalesByCategory();
    });
}

function groupAndShowSalesByCategory(){
    //Group
    categories.forEach(c => {
        let sumAmount = 0;
        salesCategory.forEach(sc => {
            if (c.id == sc.categoryId){
                sumAmount += sc.amount;
            }
        })

        c.amount = sumAmount;
    })

    //Show
    let tableBody = document.getElementById("salesCatBody");
    let counter = 0;
    tableBody.innerHTML = "";
    categories.forEach(c =>{
        if (c.amount != 0){
            let tr = document.createElement("tr");
            tr.setAttribute("id", "row-" + counter);
      
            let tdIndex = document.createElement("td");
            tdIndex.innerHTML = counter + 1;
            tr.appendChild(tdIndex);
    
            let tdCategory = document.createElement("td");
            tdCategory.innerHTML = c.name;
            tr.appendChild(tdCategory);
    
            let tdAmount= document.createElement("td");
            tdAmount.setAttribute('style', 'text-align:right;')
            tdAmount.innerHTML = `C${formatter.format(c.amount)}`;
            tr.appendChild(tdAmount);
    
            tableBody.appendChild(tr);
        }
        
    })
}

function groupAndShowSalesByProduct(){
    let productsDistinct = salesProduct.map(p => {
       return p.productName
    });
    productsDistinct = productsDistinct.filter(onlyUnique);

    console.log('productsDistinct')
    console.log(productsDistinct)
    productsDistinct.forEach(p =>{
        products.push({
            name: p,
            amount: 0,
        });
    });

    console.log(products)
    console.log(salesProduct)
    products.forEach(p =>{
        let sumAmount = 0;
        salesProduct.forEach(sp => {
            if (p.name == sp.productName){
                sumAmount += sp.amount;
            }
        })

        p.amount = sumAmount;
    });

     //Show
     let tableBody = document.getElementById("salesProBody");
     let counter = 0;
     tableBody.innerHTML = "";
     products.forEach(p =>{
         let tr = document.createElement("tr");
         tr.setAttribute("id", "row-" + counter);
   
         let tdIndex = document.createElement("td");
         tdIndex.innerHTML = counter + 1;
         tr.appendChild(tdIndex);
 
         let tdCategory = document.createElement("td");
         tdCategory.innerHTML = p.name;
         tr.appendChild(tdCategory);
 
         let tdAmount= document.createElement("td");
         tdAmount.setAttribute('style', 'text-align:right;')
         tdAmount.innerHTML = `C${formatter.format(p.amount)}`;
         tr.appendChild(tdAmount);
 
         tableBody.appendChild(tr);
     })
}

function getSalesByProduct(){
    const orderRef = firebase.database().ref("order/");
  orderRef
    .orderByChild("status")
    .equalTo("COMPLETED")
    .on("value", function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        let childKey = childSnapshot.key;
        let childData = childSnapshot.val();
        let items = [];

        items = childData.items;

        items.forEach((i) => {

            salesProduct.push({
                productName: i.name,
                amount: i.subtotal,
            });
        });
      });

      //console.log("SALES BY CATEGORY");
      console.log(salesCategory);
      groupAndShowSalesByProduct();
    });
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}