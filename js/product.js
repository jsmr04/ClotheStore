

class Product{
    constructor(id, name, description, category, price, stock, dateTime, active, pictures){
      this.id = id;
      this.name = name;
      this.description = description;
      this.category = category;
      this.price = price;
      this.stock = stock;
      this.dateTime = dateTime;
      this.active = active;
      this.pictures = pictures;
    }
  
    save() {
      firebase.database().ref(`product/${this.id}`).set(this);
    }
  }

  let products = [];
  let pictures = [];

  getProducts();
  fillCategoriesDropdown()

     // Check for the File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('productPictureInput').addEventListener('change', handleFileSelect, false);
} else {
    alert('The File APIs are not fully supported in this browser.');
}

function fillCategoriesDropdown() {
    const categorySelect = document.getElementById("productCatSelect");
    const categoryRef = firebase.database().ref("category/");
    let counter = 1;
  
    categoryRef.once("value", function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        let option = document.createElement("option");
        option.innerHTML = childSnapshot.key ;
        
        if (childSnapshot.val()["active"]){
            categorySelect.appendChild(option);
        }
      });
    });
  }

  function getProducts(){
    //TODO: Implement this function to get the list of products from Firebase
    const tableBody = document.getElementById("productBody");
    const productRef = firebase.database().ref("product/");
    
    productRef.on("value", function (snapshot) {
      let counter = 0;
      tableBody.innerHTML = "";
      snapshot.forEach(function (childSnapshot) {
        let tr = document.createElement("tr");
        tr.setAttribute("id", "row-" + counter);
  
        let childKey = childSnapshot.key;
        let childData = childSnapshot.val();
  
        let tdIndex = document.createElement("td");
        tdIndex.innerHTML = counter + 1;
        tr.appendChild(tdIndex);
  
        let tdId = document.createElement("td");
        tdId.innerHTML = childKey;
        tr.appendChild(tdId);
  
        let tdName = document.createElement("td");
        tdName.innerHTML = childData["name"];
        tr.appendChild(tdName);
  
        let tdCategory = document.createElement("td");
        tdCategory.innerHTML = childData["category"];
        tr.appendChild(tdCategory);
  
        let tdPrice = document.createElement("td");
        tdPrice.innerHTML = childData["price"];
        tr.appendChild(tdPrice);
  
        let tdStock = document.createElement("td");
        tdStock.innerHTML = childData["stock"];
        tr.appendChild(tdStock);
  
        let tdStatus = document.createElement("td");
        tdStatus.innerHTML = childData["active"] ? "Active" : "Inactive";
        tr.appendChild(tdStatus);
  
        tableBody.appendChild(tr);
        counter++;

        //Creating list of products

        let product = Product()
        let id = childKey;
        let name = childData["name"];;
        let category = childData["category"];
        let description = document.getElementById('productDescInput').value;
        let price = Number(document.getElementById('productPriceInput').value);
        let stock = Number(document.getElementById('productStockInput').value);
        let active = true;
      });
    });
  
  }
  
  function saveProduct(){
    let id = document.getElementById('productIdInput').value;
    let name = document.getElementById('productNameInput').value;
    let category = document.getElementById('productCatSelect').value;
    let description = document.getElementById('productDescInput').value;
    let price = Number(document.getElementById('productPriceInput').value);
    let stock = Number(document.getElementById('productStockInput').value);
    let active = true;
  
    if (id != '' &&  name != '' && price != '' && stock != ''){
      const product = new Product(id, 
                                  name, 
                                  description, 
                                  category, 
                                  price, 
                                  stock, 
                                  getDate(), 
                                  active,
                                  pictures);
      console.log(Product)
      product.save(); 
    }
  
  }
  
  function handleFileSelect(evt) {
    
    let f = evt.target.files[0]; // FileList object
    let reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        let binaryData = e.target.result;
        const picture = {
            name: f.name,
            base64String: window.btoa(binaryData),
        }

        pictures.push(picture);
        showPictureName();
        console.log(pictures);
        document.getElementById('productPictureInput').value = '';
      };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsBinaryString(f);
  }

function showPictureName(){
        let index = 0;
        let pictureContainer = document.getElementById('list-pics');
        pictureContainer.innerHTML = '';
        pictures.forEach((p) => {
            let divElement = document.createElement('div');
            let spanElement = document.createElement('span');
      
            //Adding event
            divElement.setAttribute('onclick',`removePicture(${index})`);
      
            //Name
            spanElement.innerHTML = p.name;
      
            //Appending children
            divElement.appendChild(spanElement);
            pictureContainer.appendChild(divElement);

            index++;
        });
  }

function removePicture(index){
    pictures.splice(index, 1);
    showPictureName();
}