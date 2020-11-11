function getAllChemicalitem(){
    axios.get('http://localhost:3000/Chemicals')
    .then(function (response) {
      let tr="";
      let tbody = document.querySelector(".tbody-chemicals-item");

      response.data.forEach(item=>{
          tr+=`<tr>
                <td >${item.itemName}</td>
                <td>
                  <span>${item.Qty}</span><span class="measurement">${item.measurement}</span>
                </td>
                <td>${item.borrowed}</td>
                <td onclick="showEditChemicalModal(${item.Qty}, ${item.id}, '${item.itemName}')">Edit</td>
            </tr>`;
      })

      tbody.innerHTML = tr;

    })
    .catch(function (error) {
      console.log(error);
    })
}
getAllChemicalitem()


function openAddChemicalModal(){
    const modal = document.querySelector(".modal-add-chemical-bg");
    modal.style.display ="block";
}

function closeAddModalChemical(){
    const modal = document.querySelector(".modal-add-chemical-bg");
    modal.style.display ="none";
}

function addChemical(){
    let itemname = document.querySelector("#formChemicalItemName").value;
    let Qty = document.querySelector("#formChemicalQty").value;
    let measurement = document.querySelector("#formChemicalMeasurement").value;
    
    if(itemname =="" || Qty =="" || measurement ==""){
        ipcRenderer.send("popup:alert", {message: "Please complete the form"});
        return;
    }

    axios.post('http://localhost:3000/Chemicals',{
        "itemName": itemname,
        "Qty": Qty,
        "measurement": measurement,
        "borrowed": 0
    })
    .then(function (response) {
      console.log(response.data);
      location.reload(); 
    })
    .catch(function (error) {
      console.log(error);
    })
}

let onChemicalEdit;

function showEditChemicalModal(Qty, id, name){
    let input = document.querySelector("#formEditChemicalNewQty");
    let title = document.querySelector(".edit-chemical-itemName");
    
    input.value = Qty
    title.innerHTML =name.toUpperCase();
    onChemicalEdit=id
  
    const modal = document.querySelector(".modal-edit-chemicals-bg");
    modal.style.display ="block"
}

function closeEditChemicalModal(){
    const modal = document.querySelector(".modal-edit-chemicals-bg");
    modal.style.display ="none"
}

function saveEditChemical(){
    let targetId = onChemicalEdit
    let newQty = document.querySelector("#formEditChemicalNewQty").value
  
    axios.get(`http://localhost:3000/Chemicals/${targetId}`)
    .then(function (response) {
        item=response.data;
        item.Qty=newQty
        axios.put(`http://localhost:3000/Chemicals/${targetId}`,item)
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
}

function showDeleteChemicalConfirmation(){
    const confirmation = document.querySelector(".delete-chemical-confirmation")
    confirmation.style.display ="block"
}
function hideDeleteChemicalConfirmation(){
    const confirmation = document.querySelector(".delete-chemical-confirmation")
    confirmation.style.display ="none"
}

function deleteChemical(){
    let targetId = onChemicalEdit
  
    axios.delete(`http://localhost:3000/Chemicals/${targetId}`)
    .then(function (response) {
      console.log(response.data);
      location.reload(); 
    })
    .catch(function (error) {
      console.log(error);
    })
  
}