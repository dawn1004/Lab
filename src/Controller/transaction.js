function getAllTransactions(){
    axios.get('http://localhost:3000/Transactions')
    .then(function (response) {
      let tr="";
      let tbody = document.querySelector(".tbody-transactions");

      response.data.forEach(item=>{
          tr+=`<tr>
                <td >${item.id}</td>
                <td>${item.student_num}</td>
                <td>${item.student_name}</td>
                <td>${item.date_borrowed}</td>
                <td>${item.return_date}</td>
                <td>Return</td>
            </tr>`;
      })

      tbody.innerHTML = tr;

    })
    .catch(function (error) {
      console.log(error);
    })
}
getAllTransactions()

function openBarrowModal(){
    let modal = document.querySelector(".add-trans-modal-bg")
    modal.style.display="block"

    //adding of checkbox elements
    axios.get('http://localhost:3000/Apparatus')
    .then(function (response) {
      let textBoxes = "";
      const textboxContainer = document.querySelector(".apparatus-textfield-container");

      response.data.forEach(item=>{
        textBoxes+=`
            <div class="form-group row px-4">
                <label  class="col-sm-4 col-form-label">${item.itemName}</label>
                <div class="col-sm-4">
                <input type="number" 
                id="appa^${item.id}"
                class="form-control apparatus-textfield"
                value="0"
                >
                </div>
            </div>`
      })
      textboxContainer.innerHTML =textBoxes;
    })
    .catch(function (error) {
      console.log(error);
    })

    axios.get('http://localhost:3000/Chemicals')
    .then(function (response) {
      let textBoxes = "";
      const textboxContainer = document.querySelector(".chemicals-textfield-container");

      response.data.forEach(item=>{
        textBoxes+=`
            <div class="form-group row px-4">
                <label  class="col-sm-4 col-form-label">${item.itemName}</label>
                <div class="col-sm-4">
                <input type="number" 
                id="chems^${item.id}"
                class="form-control chems-textfield"
                value="0"
                >
                </div>
            </div>`
      })
      textboxContainer.innerHTML =textBoxes;
    })
    .catch(function (error) {
      console.log(error);
    })

}

function closeBorrowModal(){
    let modal = document.querySelector(".add-trans-modal-bg")
    modal.style.display="none"
}

function saveTransaction(){
    const formstudentNo = document.querySelector("#formstudentNo").value
    const formstudentName = document.querySelector("#formstudentName").value
    const formProfName = document.querySelector("#formProfName").value
    const formReturnDate = document.querySelector("#formReturnDate").value
    if(formstudentNo == "" || formstudentName =="" || formProfName=="" || formReturnDate==""){
        ipcRenderer.send("popup:alert", {message: "Please complete the form"});
        return
    }

    checkTextFieldApparatus()
}

function checkTextFieldApparatus(){
    const textFields = document.querySelectorAll(".apparatus-textfield");

    let barrowedIdArray = [];

    textFields.forEach(tf=>{
        if(tf.value != 0){
            let id =tf.id.split("^")[1];
            let borrowed = parseInt(tf.value);
            barrowedIdArray.push({id: id, borrowed: borrowed});
        }
    })
    addTransaction(barrowedIdArray);

    textFields.forEach(tf=>{
        if(tf.value != 0){
            let id =tf.id.split("^")[1];
            let addvalue = parseInt(tf.value);

            axios.get(`http://localhost:3000/Apparatus/${id}`)
            .then(function (response) {
                item=response.data;
                item.Qty= item.Qty-addvalue
                item.borrowed = item.borrowed+addvalue

                axios.put(`http://localhost:3000/Apparatus/${id}`,item)
                .then(function (response) {
                  console.log(response.data);
                //   addTransaction();

                })
                .catch(function (error) {
                  console.log(error);
                })
            })
            .catch(function (error) {
              console.log(error);
            })
        }
        
    })
}

function checkAddChems(){
    const textFields = document.querySelectorAll(".chems-textfield");
    let barrowedIdArray = [];

    textFields.forEach(tf=>{
        if(tf.value != 0){
            let id =tf.id.split("^")[1];
            let borrowed = parseInt(tf.value);
            barrowedIdArray.push({id: id, borrowed: borrowed});
        }
    })
    return(barrowedIdArray);
}

function decrementChemicals(chems){
    console.log("chemsssssssssssss")
    chems.forEach(chem=>{
        axios.get(`http://localhost:3000/Chemicals/${chem.id}`)
        .then(function (response) {
            item=response.data;
            item.Qty= item.Qty-chem.borrowed
            item.borrowed = item.borrowed+chem.borrowed

            axios.put(`http://localhost:3000/Chemicals/${chem.id}`,item)
            .then(function (response) {
              console.log(response.data);
            })
            .catch(function (error) {
              console.log(error);
            })
        })
        .catch(function (error) {
          console.log(error);
        })
    })
}

function addTransaction(apparatus){
    
    const formstudentNo = document.querySelector("#formstudentNo").value
    const formstudentName = document.querySelector("#formstudentName").value
    const formProfName = document.querySelector("#formProfName").value
    const formReturnDate = document.querySelector("#formReturnDate").value
    const date_borrowed = new Date().toISOString().slice(0, 10);
    const chemicals = checkAddChems()

    decrementChemicals(chemicals)

    axios.post(`http://localhost:3000/Transactions`,{
        student_num: formstudentNo,
        student_name: formstudentName,
        prof_name: formProfName,
        date_borrowed: date_borrowed,
        return_date: formReturnDate,
        chemicals: chemicals,
        apparatus: apparatus
    })
    .then(function (response) {
      console.log(response.data);
      setTimeout(() => {
        location.reload(); 
      }, 500);
    })
    .catch(function (error) {
      console.log(error);
    })
}