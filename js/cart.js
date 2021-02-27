
function inflateMainShoppingCart() {
    let mainContainer = document.getElementById("mainContainer");
    let subtotalAmount = document.getElementById("subtotalAmount");
    let totalFooter = 0;

    if (mainContainer == undefined){
        return;
    }
    console.log('toy aqui coooo')
    
    cartItemList.forEach((i) => {
      let product = shoppingCartProducts.filter(
        (p) => p.productId == i.productId
      )[0];
        
      
      if (product != undefined) {
        
        let itemContainerDiv = document.createElement("div");
        let itemItemDiv = document.createElement("div");
        let itemImgDiv = document.createElement("div");
        let itemImg = document.createElement("img");

        let itemBodyDiv = document.createElement("div");
        let itemTextDiv = document.createElement("div");

        let itemSizeDiv = document.createElement("div");

        let itemPriceDiv = document.createElement("div");

        let itemQtyDiv = document.createElement("div");
        let itemQtyChildDiv = document.createElement("div");
        let qtyInput = document.createElement("input");

        let deviderDiv = document.createElement("div");
        let amountDiv = document.createElement("div");

        let deleteA = document.createElement("a");

        //Main Div
        itemContainerDiv.setAttribute('class','container-cart');
        itemItemDiv.setAttribute('class','item-cel d-flex');

        //Image
        itemImgDiv.setAttribute('class','item-img mr-3 corner-cel');
        itemImg.setAttribute('class','rounded-sm mr-3');
        itemImg.setAttribute("style", "object-fit:contain;max-height:200px");
        itemImg.setAttribute("src", `data:image/png;base64,${product.picture}`);
        itemImgDiv.appendChild(itemImg);

        //Body
        //text
        itemBodyDiv.setAttribute('class','flex-column mr-3 middle-cel');
        itemTextDiv.setAttribute('class','text-truncate m-bottom');
        itemTextDiv.innerHTML = `<b>${product.name}</b>`;
        itemBodyDiv.appendChild(itemTextDiv);
        
        //size 
        itemSizeDiv.setAttribute('class','m-bottom');
        itemSizeDiv.innerHTML = `Size: <b id="item-size">${i.size}</b>`;
        itemBodyDiv.appendChild(itemSizeDiv);

        //Price 
        itemPriceDiv.setAttribute('class','m-bottom');
        itemPriceDiv.innerHTML = `Price: <b id="item-size">${formatter.format(product.price)}</b>`;
        itemBodyDiv.appendChild(itemPriceDiv);
        
        //Quantity
        itemQtyDiv.setAttribute('class','d-flex');
        
        itemQtyChildDiv.setAttribute('style','text-align: center; margin-top:5px; margin-right: 5px;')
        itemQtyChildDiv.innerText = 'Qt:'
        itemQtyDiv.appendChild(itemQtyChildDiv);

        qtyInput.setAttribute('type', 'number');
        qtyInput.setAttribute('class', 'form-control item-select');
        qtyInput.setAttribute('min', '1');
        qtyInput.setAttribute('max', '99');
        qtyInput.setAttribute('value',i.quantity);
        itemQtyDiv.appendChild(qtyInput);

        deviderDiv.setAttribute('class', 'divider-vertical');

        //Price
        let total = Number(i.quantity) * product.price;
        totalFooter += total; //Acumulate total

        amountDiv.setAttribute('class', 'ml-3 item-price corner-cel mr-3');
        amountDiv.innerHTML = `<b>C${formatter.format(total)}</b>`;

        //Delete
        deleteA.setAttribute('class', 'item-icon-delete mr-3');
        deleteA.innerHTML='<i class="fas fa-trash"></i>';

        itemBodyDiv.appendChild(itemQtyDiv);
        
        itemItemDiv.appendChild(itemImgDiv);
        itemItemDiv.appendChild(itemBodyDiv);
        itemItemDiv.appendChild(deviderDiv);
        itemItemDiv.appendChild(amountDiv);
        itemItemDiv.appendChild(deleteA);

        itemContainerDiv.appendChild(itemItemDiv);
        mainContainer.appendChild(itemContainerDiv);
      }
    });

    subtotalAmount.innerText = `C${formatter.format(totalFooter)}`


}


  