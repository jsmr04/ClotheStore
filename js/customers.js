getCustomers();

function getCustomers() {
    const tableBody = document.getElementById("customerBody");
    const categoryRef = firebase.database().ref("userInfo/");

    categoryRef.on("value", function(snapshot) {
        let counter = 0;
        tableBody.innerHTML = "";
        console.log()
        snapshot.forEach(function(childSnapshot) {
            let tr = document.createElement("tr");
            tr.setAttribute("id", "row-" + counter);

            let childData = childSnapshot.val();

            let tdIndex = document.createElement("td");
            tdIndex.innerHTML = counter + 1;
            tr.appendChild(tdIndex);

            let tdEmail = document.createElement("td");
            tdEmail.innerHTML = childData["email"];
            tr.appendChild(tdEmail);

            let tdFirstName = document.createElement("td");
            tdFirstName.innerHTML = childData["firstName"];
            tr.appendChild(tdFirstName);

            let tdLastName = document.createElement("td");
            tdLastName.innerHTML = childData["lastName"];
            tr.appendChild(tdLastName);

            let tdAddress = document.createElement("td");
            tdAddress.innerHTML = childData["address"];
            tr.appendChild(tdAddress);

            let tdCountry = document.createElement("td");
            tdCountry.innerHTML = childData["country"];
            tr.appendChild(tdCountry);

            let tdState = document.createElement("td");
            tdState.innerHTML = childData["state"];
            tr.appendChild(tdState);

            let tdZip = document.createElement("td");
            tdZip.innerHTML = childData["zip"];
            tr.appendChild(tdZip);

            let aOrders = document.createElement("a");
            aOrders.innerHTML = 'Orders';
            aOrders.setAttribute("href", `orders.html?userId=${childSnapshot.key}`);

            let tdOrders = document.createElement("td");
            tdOrders.appendChild(aOrders);
            tr.appendChild(tdOrders);

            tableBody.appendChild(tr);

            counter++;
        });
        //This script below enables the Jquery to work properly(search, filter, pagination)
        $(document).ready(function() {
            $('#dataTable').DataTable();
        });
    });
}