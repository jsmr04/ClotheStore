let userKey;
let userEmail;
let userFName;
let userLName; 
let userAddress; 
let userState; 
let userCountry; 
let userZip; 


function getDataUser(key) {
    userKey = key;
    const userRef = firebase.database().ref("userInfo/" + key);

    userRef.on("value", function(snapshot) {
        let userEmail = document.getElementById("email");
        let userFName = document.getElementById("firstName");
        let userLName = document.getElementById("lastName");
        let address = document.getElementById("address");
        let state = document.getElementById("state");
        let country = document.getElementById("country");
        let zip = document.getElementById("zip");
        
        console.log(snapshot.val());
        
        userEmail.value = snapshot.val()["email"];
        userFName.value = snapshot.val()["firstName"];
        userLName.value = snapshot.val()["lastName"];
        address.value = snapshot.val()["address"];
        state.value = snapshot.val()["state"];
        country.value = snapshot.val()["country"];
        zip.value = snapshot.val()["zip"];
    });
}

function getUserInfo(){
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            getDataUser(user.uid);
            console.log(user.uid);
        }
      });
}
getUserInfo();

function edit(){
    console.log("Edit")
    userEmail = document.getElementById("email").value;
    userFName = document.getElementById("firstName").value;
    userLName = document.getElementById("lastName").value;
    userAddress = document.getElementById("address").value;
    userState = document.getElementById("state").value;
    userCountry = document.getElementById("country").value;
    userZip = document.getElementById("zip").value;

    console.log(userEmail);
    console.log(userFName);
    console.log(userLName);
    console.log(userAddress);
    console.log(userState);
    console.log(userCountry);
    console.log(userZip);
}

function save() {

    var userData = {
        email: userEmail,
        firstName: userFName,
        lastName: userLName,
        address: userAddress,
        state: userState,
        country: userCountry,
        zip: userZip

    };

    firebase.database().ref("userInfo/"+ userKey).set(userData);

}

