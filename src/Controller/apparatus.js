const { ipcRenderer }  = electron;



function openAddApparatusModal(){
    const modal = document.querySelector(".modal-add-apparatus-bg");
    modal.style.display ="block";
}
function closeAddModalAparatus(){
    const modal = document.querySelector(".modal-add-apparatus-bg");
    modal.style.display ="none";
}

function addApparatus(){
    let itemCode = document.querySelector("#formApparatusItemCode").value
    let itemname = document.querySelector("#formApparatusItemName").value;
    let Qty = document.querySelector("#formApparatusQty").value;
    let measurement = document.querySelector("#formApparatusMeasurement").value;
    

    if( itemCode== "" || itemname =="" || Qty =="" || measurement ==""){
        ipcRenderer.send("popup:alert", {message: "Please complete the form"});

        return;
    }

    axios.post('http://localhost:3000/Apparatus',{
        itemCode: itemCode,
        itemName: itemname,
        Qty: Qty,
        measurement: measurement,
        borrowed: 0,
        damage: 0
    })
    .then(function (response) {
      const appa = response.data;
      const today = new Date().toISOString().slice(0, 10);
      // axios.get(`http://localhost:3000/DailyReports?date=${today}`)
      //   .then((res)=> {
      //     res = res.data[0];
      
      //     res.apparatus.push({
      //       itemName: appa.itemName,
      //       id: appa.id,
      //       measurement: appa.measurement,
      //       borrowed: 0,
      //       Qty: appa.Qty
      //     })

      //     axios.put(`http://localhost:3000/DailyReports/${res.id}`, res)
      //     .then((res)=> {
      //       location.reload(); 
      //     })
      //     .catch(function (error) {
      //       console.log(error);
      //     })
          
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //     console.log("hey");
      //   })

        location.reload(); 
    })
    .catch(function (error) {
      console.log(error);
    })
}

function getAllApparatusitem(search){
    axios.get(`http://localhost:3000/Apparatus?itemName_like=${search}&_sort=id&_order=desc`)
    .then(function (response) {
      let tr="";
      let tbody = document.querySelector(".tbody-apparatus-item");

      response.data.forEach(item=>{
          tr+=`<tr>
                <td> ${item.itemCode} </td>
                <td >${item.itemName}</td>
                <td>
                  <span>${item.Qty}</span><span class="measurement">${item.measurement}</span>
                </td>
                <td>${item.borrowed}</td>
                <td>${item.damage}</td>
                <td>
                  <button 
                  onclick="showEditApparatusModal(${item.Qty}, ${item.id}, '${item.itemName}')"
                  class="btn btn-success">Edit </button>
                </td>

            </tr>`;
      })

      tbody.innerHTML = tr;

    })
    .catch(function (error) {
      console.log(error);
    })
}
getAllApparatusitem("")


const appaInputSearch = document.querySelector(".appa-input-search")
appaInputSearch.addEventListener("keyup", ({target})=>{
  getAllApparatusitem(target.value)
})


let onApparatusEdit;
function showEditApparatusModal(Qty, id, name){
  let input = document.querySelector("#formEditApparatusNewQty");
  let title = document.querySelector(".edit-apparatus-itemName");
  
  input.value = Qty
  title.innerHTML =name.toUpperCase();
  onApparatusEdit=id

  const modal = document.querySelector(".modal-edit-apparatus-bg");
  modal.style.display ="block"
}

function closeEditApparatusModal(){
  const modal = document.querySelector(".modal-edit-apparatus-bg");
  modal.style.display ="none"
}

function saveEditApparatus(){
  let targetId = onApparatusEdit
  let newQty = document.querySelector("#formEditApparatusNewQty").value

  axios.get(`http://localhost:3000/Apparatus/${targetId}`)
  .then(function (response) {
      let added = newQty-response.data.Qty
      item=response.data;
      item.Qty=newQty

      const today = new Date().toISOString().slice(0, 10);
      let stockHistory = {
        date: today,
        itemCode: response.data.itemCode,
        itemName: response.data.itemName,
        stockAdded: added,
        measurement: response.data.measurement
      }

      axios.put(`http://localhost:3000/Apparatus/${targetId}`,item)
      .then(function (response) {
        console.log(response.data);
        // location.reload(); 

          axios.post(`http://localhost:3000/stockHistory`,stockHistory)
          .then(function (response) {
            console.log(response.data);
            location.reload(); 
          })
          .catch(function (error) {
            console.log(error);
          })

      })
      .catch(function (error) {
        console.log(error);
      })


  })
  .catch(function (error) {
    console.log(error);
  })

}


function showDeleteAppatusConfirmation(){
  const confirmation = document.querySelector(".delete-apparatus-confirmation")
  confirmation.style.display ="block"
}
function hideDeleteAppatusConfirmation(){
  const confirmation = document.querySelector(".delete-apparatus-confirmation")
  confirmation.style.display ="none"
}

function deleteApparatus(){
  let targetId = onApparatusEdit

  axios.delete(`http://localhost:3000/Apparatus/${targetId}`)
  .then(function (response) {
    console.log(response.data);
    location.reload(); 
  })
  .catch(function (error) {
    console.log(error);
  })

}


function showEditChemicalModal(){
  alert();
}