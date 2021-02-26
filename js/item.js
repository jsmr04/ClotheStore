getProduct();
function getProduct(){
    if (paramProductId != undefined){
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

        let itemDesc = document.getElementById('item-desc');
        let itemPrice = document.getElementById('item-price');
        let itemDesciption = document.getElementById('item-description');

        let sizeXS = document.getElementById('sizeXS');
        let sizeS = document.getElementById('sizeS');
        let sizeM = document.getElementById('sizeM');
        let sizeL = document.getElementById('sizeL');
        let sizeXL = document.getElementById('sizeXL');

        let itemPictures = document.getElementById('itemPictures');

        itemDesc.innerText = childData["name"];
        itemPrice.innerText = `C$${childData["price"]}`
        itemDesciption.innerText = childData["description"];

        //Size - desactivate 
        if(childData["size"] != undefined){
           if (childData["size"].filter(s => s == 'XS').length == 0){
                sizeXS.setAttribute('style','pointer-events:none;');
           }

           if (childData["size"].filter(s => s == 'S').length == 0){
                sizeS.setAttribute('style','pointer-events:none;');
           }

           if (childData["size"].filter(s => s == 'M').length == 0){
                sizeM.setAttribute('style','pointer-events:none;');
           }

           if (childData["size"].filter(s => s == 'L').length == 0){
                sizeL.setAttribute('style','pointer-events:none;');
           }

           if (childData["size"].filter(s => s == 'XL').length == 0){
                sizeXL.setAttribute('style','pointer-events:none;');
           }
            
        }

        //Pictures
        let firstItem = true;
        console.log(childData["pictures"])
        if(childData["pictures"] != undefined){
            console.log(childData["pictures"])
            childData["pictures"].forEach(p => {
                console.log(p.name);
                let carouselDiv = document.createElement('div');
                let pictureImg = document.createElement('img');

                carouselDiv.setAttribute('class',`carousel-item ${firstItem ? 'active': ''}`);
                firstItem = false;//Only the first item has to be active

                pictureImg.setAttribute('class','d-block img-fluid');
                pictureImg.setAttribute("style", "object-fit:contain;max-height:240px");

                pictureImg.setAttribute(
                    "src",
                    `data:image/png;base64,${p.base64String}`
                  );

                carouselDiv.appendChild(pictureImg);
                itemPictures.appendChild(carouselDiv);
            })
        }


        //console.log(childData);
      });
    });
    }
}