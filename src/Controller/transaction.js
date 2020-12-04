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
                <td>${item.subject}</td>
                <td>${item.section}</td>
                <td>${item.prof_name}</td>
                <td>${item.date_borrowed}</td>
                <td>${item.return_date}</td>
                <td >
                  <button 
                  onclick="showReturnDialog(${item.id})"
                  class="btn btn-success">Return </button>
                </td>
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
            <div class="list-chemss form-group row px-4">
                <label  class=" col-form-label">${item.itemName}</label>
                <div class="">
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
    const formSubject = document.querySelector("#formSubject").value
    const formSection = document.querySelector("#formSection").value
    if(
      formSubject=="" || formSection == "" || formstudentNo == "" || 
      formstudentName =="" || formProfName=="" || formReturnDate==""){
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
    const formSubject = document.querySelector("#formSubject").value
    const formSection = document.querySelector("#formSection").value
    const date_borrowed = new Date().toISOString().slice(0, 10);
    const chemicals = checkAddChems()

    decrementChemicals(chemicals)


    // updateDailyReport(chemicals,apparatus)

    let endpoint=""; 

    if(apparatus.length > 0){
      endpoint="Transactions"
    }else{
      endpoint="History"
    }

    axios.post(`http://localhost:3000/${endpoint}`,{
        student_num: formstudentNo,
        student_name: formstudentName,
        subject: formSubject,
        section: formSection,
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


//update the daily report
// function updateDailyReport(chemicals, apparatus){
//     const today = new Date().toISOString().slice(0, 10);

//     axios.get(`http://localhost:3000/DailyReports?date=${today}`)
//     .then(function (response) {
//       let reports = response.data[0];

//       chemicals.forEach(chem=>{
//         reports.chemicals.forEach(repchem=>{
//           if(chem.id == repchem.id){
//             repchem.borrowed+=chem.borrowed;
//           }
//         })
//       })

//       apparatus.forEach(appa=>{
//         reports.apparatus.forEach(repappa=>{
//           if(appa.id == repappa.id){
//             repappa.borrowed+= appa.borrowed;
//           }
//         })
//       })


//       axios.put(`http://localhost:3000/DailyReports/${reports.id}`,reports)
//       .then(function (response) {
//       })
//       .catch(function (error) {
//         console.log(error);
//       })


//     })
//     .catch(function (error) {
//       console.log(error);
//     })  
// }


function showReturnDialog(id){
  const dialog = document.querySelector(".return-barrowed-dialog")
  dialog.style.display= "block";
  listToReturn(id)

}

function hideReturnDialog(){
  const dialog = document.querySelector(".return-barrowed-dialog")
  dialog.style.display= "none";
}


let TargetTrans;
let returnState = []
function listToReturn(id){
  returnState=[]
  TargetTrans=""
  let tbody = document.querySelector(".table-return-item");
  const transNum = document.querySelector(".trans-num")
  let tr=""

        axios.get(`http://localhost:3000/Transactions/${id}`)
        .then(function (response) {
          let transaction = response.data;
          transNum.innerHTML = transaction.id;
          TargetTrans = transaction.id;
        
          const apparatus = transaction.apparatus;

          apparatus.forEach(item=>{
            axios.get(`http://localhost:3000/Apparatus/${item.id}`)
            .then(function (response) {
              
              returnState.push({aparatusID: response.data.id ,  damage: 0, borrowed: item.borrowed})

              console.log(TargetTrans)
                tr+= `<tr>
                        <td>${response.data.itemName}</td>
                        <td>${item.borrowed}</td>
                        <td>
                        <input 
                          type="number" 
                          value="0" 
                          min="0" 
                          max="${response.data.borrowed}"
                          onchange="updateCurrentReturnItem(${response.data.id}, this.value)"
                          class="form-control" 
                          style="width: 90px;"
                        >
                        </td>
                      </tr>`;

                tbody.innerHTML = tr;
            })
            .catch(function (error) {
              console.log(error);
            })

          })
          


          
        })
        .catch(function (error) {
          console.log(error);
        })
}



function updateCurrentReturnItem(id, value){

  console.log(TargetTrans)
  returnState.forEach(item=>{
    if(item.aparatusID == id){
      item.damage = value;
    }
  })

  console.log(returnState)
}


// TargetTrans;
// returnState: aparatusID, damage, borrowed

//remove trasaction and move to history
//add (borrowed_apparatus-damage) to apparatus qty


function returnTransaction(){

  axios.get(`http://localhost:3000/Transactions/${TargetTrans}`)
  .then(function (response) {
    let history =response.data;
    history.returned_date = new Date().toISOString().slice(0, 10)
    // history.id = null
    delete history["id"]
    axios.post(`http://localhost:3000/History`,history)
    .then(function (response) {
      console.log(response.data);
      // setTimeout(() => {
      //   location.reload(); 
      // }, 500);
    })
    .catch(function (error) {
      console.log(error);
    })

    axios.delete(`http://localhost:3000/Transactions/${TargetTrans}`)
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

  
  returnState.forEach(item=>{

    axios.get(`http://localhost:3000/Apparatus/${item.aparatusID}`)
    .then(function (response) {
          
          let appa = response.data;

          appa.borrowed= appa.borrowed - item.borrowed;
          appa.Qty = appa.Qty+(item.borrowed-item.damage)
          appa.damage+=parseInt(item.damage);

          axios.put(`http://localhost:3000/Apparatus/${item.aparatusID}`,appa)
          .then(function (response) {
            console.log(response.data);
            setTimeout(() => {
              location.reload(); 
            }, 500);
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



