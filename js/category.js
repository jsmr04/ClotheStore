$('#modal-category').on('shown.bs.modal', function() {
    $(this).find('input:first').focus();
});

let lastId = 0;
let editMode = false;
let editiD = "";
let elementId = '';
getCategories();

function showStatusModal(rowId) {
    elementId = rowId;
}

function updateStatus() {
    changeCategoryStatus(elementId);
}

function getCategories() {
    const tableBody = document.getElementById("categoryBody");
    const categoryRef = firebase.database().ref("category/");

    categoryRef.on("value", function(snapshot) {
        let counter = 0;
        tableBody.innerHTML = "";
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
            tdName.innerHTML = childData["categoryName"];
            tr.appendChild(tdName);

            let tdDate = document.createElement("td");
            tdDate.innerHTML = childData["dateTime"];
            tr.appendChild(tdDate);

            let aStatus = document.createElement("a");
            let elementId = "row-" + counter;

            //aStatus.setAttribute('category',childKey);
            aStatus.innerHTML = childData["active"] ? "Active" : "Inactive";
            aStatus.setAttribute("href", "#");
            aStatus.setAttribute("onClick", `showStatusModal('${elementId}')`);

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
            iEdit.setAttribute("data-target", "#modal-category");
            iEdit.setAttribute("onClick", `editCategory('${childKey}', '${childData["categoryName"]}')`);

            let tdEdit = document.createElement("td");
            tdEdit.appendChild(iEdit);
            tr.appendChild(tdEdit);

            //let tdDelete = document.createElement("td");
            //tdDelete.innerHTML = '<i class="fas fa-trash-alt"></i>';
            //tr.appendChild(tdDelete);

            tableBody.appendChild(tr);
            counter++;
            lastId = parseInt(childKey);
        });
        //This script below enables the Jquery to work properly(search, filter, pagination)
        $(document).ready(function() {
            $('#dataTable').DataTable();
        });
    });
}

function editCategory(index, categoryName) {
    document.getElementById("modalTitle").innerHTML = "Update Category";
    document.getElementById("categoryInput").value = categoryName;

    console.log(index + " " + categoryName);

    editMode = true;
    editiD = index;
}

function saveCategory() {
    const categoryName = document.getElementById("categoryInput").value;
    let id = lastId + 1;
    if (categoryName.trim() != '') {
        const now = getDate();

        if (editMode) {
            id = editiD;
        }
        const category = {
            id: id,
            categoryName: categoryName,
            dateTime: now,
            active: true,
        };

        console.log(category);
        firebase.database().ref(`category/${category.id}`).set(category);
        //firebase.database().ref(`category/${category.categoryName}`).set(category);

        console.log("Category saved");
        console.log(category);
    }
    document.getElementById("categoryInput").value = '';
}

function newCategory() {
    document.getElementById("modalTitle").innerHTML = "New Category";
    document.getElementById("categoryInput").value = ""
    editMode = false;
}


function changeCategoryStatus(elementId) {
    const row = document.getElementById(elementId);
    const id = row.childNodes[1].innerHTML;
    const categoryName = row.childNodes[2].innerHTML;
    const categoryDateTime = row.childNodes[3].innerHTML;
    const categoryStatus = row.childNodes[4].childNodes[0].innerHTML;

    const isActive = categoryStatus === "Active" ? true : false;

    const category = {
        id: id,
        categoryName: categoryName,
        dateTime: categoryDateTime,
        active: !isActive,
    };

    console.log(category);

    firebase.database().ref(`category/${id}`).set(category);

    //location.reload();
}