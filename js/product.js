$('#modal-product').on('shown.bs.modal', function() {
    $(this).find('input:first').focus();
});

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
        pictures
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
    }

    save() {
        firebase.database().ref(`product/${this.id}`).set(this);
    }
}

let products = [];
let pictures = [];
let productIndex = -1;
let editMode = false;
let categories = [];


fillCategoriesDropdown();
getProducts();


// Check for the File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    document
        .getElementById("productPictureInput")
        .addEventListener("change", handleFileSelect, false);
} else {
    alert("The File APIs are not fully supported in this browser.");
}

function fillCategoriesDropdown() {
    const categorySelect = document.getElementById("productCatSelect");
    const categoryRef = firebase.database().ref("category/");

    categoryRef.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            let option = document.createElement("option");
            option.innerHTML = childSnapshot.val()["categoryName"];

            if (childSnapshot.val()["active"]) {
                categorySelect.appendChild(option);
            }
            categories.push({ name: childSnapshot.val()["categoryName"], id: childSnapshot.key })
        });
    });
    console.log(categories);
}

function getProducts() {
    //TODO: Implement this function to get the list of products from Firebase
    const tableBody = document.getElementById("productBody");
    const productRef = firebase.database().ref("product/");

    productRef.on("value", function(snapshot) {
        let counter = 0;
        tableBody.innerHTML = "";
        products = [];

        snapshot.forEach(function(childSnapshot) {
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
            let cat = getCategoryName(childData["category"]);
            tdCategory.innerHTML = cat;
            tr.appendChild(tdCategory);

            let tdPrice = document.createElement("td");
            tdPrice.innerHTML = childData["price"];
            tr.appendChild(tdPrice);

            let tdStock = document.createElement("td");
            tdStock.innerHTML = childData["stock"];
            tr.appendChild(tdStock);

            let aStatus = document.createElement("a");
            //aStatus.setAttribute('category',childKey);
            aStatus.innerHTML = childData["active"] ? "Active" : "Inactive";
            aStatus.setAttribute("href", "#");
            aStatus.setAttribute("onClick", `showStatusModal('${counter}')`);

            //Show modal
            aStatus.setAttribute("data-toggle", "modal");
            aStatus.setAttribute("data-target", "#changeStatusModal");

            //data-toggle="modal" data-target="#changeStatusModal"
            let tdStatus = document.createElement("td");
            tdStatus.appendChild(aStatus);
            tr.appendChild(tdStatus);

            let iEdit = document.createElement("i");
            iEdit.setAttribute("class", "fas fa-pencil-alt");
            iEdit.setAttribute("style", "font-size: 1.4rem; color: #5a2d82;");

            //Show modal
            iEdit.setAttribute("data-toggle", "modal");
            iEdit.setAttribute("data-target", "#modal-product");
            iEdit.setAttribute("onClick", `editProduct('${counter}')`);

            let tdEdit = document.createElement("td");
            tdEdit.appendChild(iEdit);
            tr.appendChild(tdEdit);

            tableBody.appendChild(tr);
            counter++;

            //Creating list of products
            let id = childKey;
            let name = childData["name"];
            let category = getCategoryName(childData["category"]);
            let description = childData["description"];
            let price = childData["price"];
            let stock = childData["stock"];
            let dateTime = childData["dateTime"];
            let active = childData["active"];
            let pictures = childData["pictures"];

            const product = new Product(
                id,
                name,
                description,
                category,
                price,
                stock,
                dateTime,
                active,
                pictures
            );
            console.log(product);
            products.push(product);
        });

        //This script below enables the Jquery to work properly(search, filter, pagination)
        $(document).ready(function() {
            $('#dataTable').DataTable();
        });
    });
}

function editProduct(index) {
    document.getElementById("modalTitle").innerHTML = "Update Product";

    let idInput = document.getElementById("productIdInput");
    let nameInput = document.getElementById("productNameInput");
    let categoryInput = document.getElementById("productCatSelect");
    let descriptionInput = document.getElementById("productDescInput");
    let priceInput = document.getElementById("productPriceInput");
    let stockInput = document.getElementById("productStockInput");

    editMode = true;
    productIndex = index;

    idInput.value = products[productIndex].id;
    idInput.setAttribute('readonly', true);
    nameInput.value = products[productIndex].name;
    categoryInput.value = products[productIndex].category;
    descriptionInput.value = products[productIndex].description;
    priceInput.value = products[productIndex].price;
    stockInput.value = products[productIndex].stock;

    //Copying pictures into temp array

    console.log(products[productIndex].pictures);
    if (products[productIndex].pictures != undefined) {
        pictures = [];
        products[productIndex].pictures.forEach((p) => {
            pictures.push({...p }); //Cloning objects 
        });
        //Now let's show image name
        showPictureName();
    } else {
        let pictureContainer = document.getElementById("list-pics");
        pictureContainer.innerHTML = "";
    }
}

function saveProduct() {

    let id = document.getElementById("productIdInput").value;
    let name = document.getElementById("productNameInput").value;
    let category = getCategoryId(document.getElementById("productCatSelect").value);
    let description = document.getElementById("productDescInput").value;
    let price = Number(document.getElementById("productPriceInput").value);
    let stock = Number(document.getElementById("productStockInput").value);
    let active;
    let dateTime;

    if (editMode) {
        active = products[productIndex].active;
        dateTime = products[productIndex].dateTime;
        products[productIndex].pictures = pictures;
    } else { //New record
        active = true;
        dateTime = getDate();
    }

    if (id != "" && name != "" && price != "" && stock != "") {
        const product = new Product(
            
            id,
            name,
            description,
            category,
            price,
            stock,
            dateTime,
            active,
            pictures
        );
        console.log(Product);
        product.save();
    }
    //Cleaning array
    pictures = [];
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
            };

            pictures.push(picture);
            showPictureName();
            console.log(pictures);
            document.getElementById("productPictureInput").value = "";
        };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsBinaryString(f);
}

function showPictureName() {
    let index = 0;
    let pictureContainer = document.getElementById("list-pics");
    pictureContainer.innerHTML = "";
    pictures.forEach((p) => {
        let divElement = document.createElement("div");
        let spanElement = document.createElement("span");

        let iRemove = document.createElement("i");
        iRemove.setAttribute("class", "bi-backspace-fill");
        iRemove.setAttribute("style", "margin-left:2px; font-size: 1rem; color: cornflowerblue;");

        //Adding event
        iRemove.setAttribute("onclick", `removePicture(${index})`);

        //Name
        spanElement.innerText = p.name;
        spanElement.setAttribute('data-bs-toggle', 'tooltip');
        spanElement.setAttribute('data-bs-html', 'true');
        //spanElement.setAttribute('title', '<img src="http://getbootstrap.com/apple-touch-icon.png" />');
        spanElement.setAttribute('title', `<img width=180 height=180 src="data:image/png;base64,${p.base64String}" />`);

        //Appending children
        spanElement.appendChild(iRemove);
        divElement.appendChild(spanElement);
        pictureContainer.appendChild(divElement);

        //Setting up tooltip
        $('span[data-bs-toggle="tooltip"]').tooltip({
            animated: 'fade',
            placement: 'bottom',
            html: true
        });

        index++;
    });
}

function removePicture(index) {
    pictures.splice(index, 1);
    showPictureName();
}

function updateStatus() {
    //Changing status
    if (productIndex >= 0) {
        products[productIndex].active = !products[productIndex].active;
        console.log('Changing status');
        console.log(products[productIndex]);

        if (products[productIndex].pictures == undefined){
            products[productIndex].pictures = [];
        }
        
        products[productIndex].category = getCategoryId(products[productIndex].category);
        
        firebase
            .database()
            .ref(`product/${products[productIndex].id}`)
            .set(products[productIndex]);
    }
}

function showStatusModal(index) {
    productIndex = index;
}

function newProduct() {
    let idInput = document.getElementById("productIdInput");
    let nameInput = document.getElementById("productNameInput");
    let categoryInput = document.getElementById("productCatSelect");
    let descriptionInput = document.getElementById("productDescInput");
    let priceInput = document.getElementById("productPriceInput");
    let stockInput = document.getElementById("productStockInput");
    let pictureContainer = document.getElementById("list-pics");
    editMode = false;

    idInput.removeAttribute('readonly');
    idInput.value = '';
    nameInput.value = '';
    categoryInput.value = '';
    descriptionInput.value = '';
    priceInput.value = '';
    stockInput.value = '';
    pictureContainer.innerHTML = '';

    pictures = [];

    console.log('here');
}


function getCategoryId(name) {
    console.log("Inside getcategory: " + name);
    for (x = 0; x < categories.length; x++) {
        console.log("Inside getcategoryIDFor: " + categories[x].name);
        if (categories[x].name == name) {
            console.log("Inside getcategoryIDForCorrect: " + categories[x].id);
            return categories[x].id;
        }
    }
}

function getCategoryName(id) {
    console.log("Inside getcategoryID: " + id);
    for (x = 0; x < categories.length; x++) {
        console.log("Inside getcategoryIDFor: " + categories[x].id);
        if (categories[x].id == id) {
            console.log("Inside getcategoryIDForCorrect: " + categories[x].name);
            return categories[x].name;
        }
    }
}