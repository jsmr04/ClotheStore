
let categories = [];

getCategories();

function getCategories(){
    const categoryRef = firebase.database().ref("category/");
    categoryRef.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            let childData = childSnapshot.val();
            categories.push(childData["categoryName"]);
        });
    
        fillClassificationDropdown();
    })
}

function fillClassificationDropdown(){
    const classArr = [
        { name:'men',
          dropdown: document.getElementById('menDropdownUl')
        },
        { name:'women',
          dropdown: document.getElementById('womenDropdownUl')
        },
        { name:'kids',
          dropdown: document.getElementById('kidsDropdownUl')
        },
    ]

    console.log(classArr);
    console.log(categories);

    classArr.forEach(cl => {
        categories.forEach(ct => {
            let li = document.createElement('li');
            let a = document.createElement('a');
            
            a.innerText = ct;
            a.setAttribute('class', 'dropdown-item')
            a.setAttribute('href', `index.html?classification=${cl.name}&category=${ct}`)

            li.appendChild(a);
            cl.dropdown.appendChild(li);
        })
    })
    
}