
// const today = new Date().toISOString().slice(0, 10);

// function checkIfDateReportExist(){
//     axios.get(`http://localhost:3000/DailyReports?date=${today}`)
//     .then(function (response) {
//         let res = response.data 
//         let apparatusList = []
//         let chemicalList = []

//         axios.get(`http://localhost:3000/Apparatus`)
//         .then(function (response) {
//             let apparatus = response.data;

//             axios.get(`http://localhost:3000/Chemicals`)
//             .then(function (response) {
//                 let chemicals = response.data;
//                 /////
//                 if(res.length ==0){
//                     apparatus.forEach(appa=>{
//                         apparatusList.push({
//                             itemName: appa.itemName,
//                             id: appa.id,
//                             measurement: appa.measurement,
//                             borrowed: 0,
//                             Qty: appa.Qty
//                         })
//                     })
//                     chemicals.forEach(chem=>{
//                         chemicalList.push({
//                             itemName: chem.itemName,
//                             id: chem.id,
//                             measurement: chem.measurement,
//                             borrowed: 0,
//                             Qty: chem.Qty
//                         })
//                     })
//                     console.log(apparatusList)
                
//                     axios.post(`http://localhost:3000/DailyReports`,{
//                         date: today,
//                         chemicals: chemicalList,
//                         apparatus: apparatusList
//                     })
//                     .then(function (response) {
                
//                     })
//                     .catch(function (error) {
//                       console.log(error);
//                     })
//                 }else{
//                     console.log("already Created")
//                 }
//                 /////
//             })
//             .catch(function (error) {
//               console.log(error);
//             })

//         })
//         .catch(function (error) {
//           console.log(error);
//         })
//     })
//     .catch(function (error) {
//       console.log(error);
//     })
// }
// checkIfDateReportExist()



// // aasdasdasdad

// function searchReport(){
//     let date = document.querySelector(".searchReport1").value

//     axios.get(`http://localhost:3000/DailyReports?date=${date}`)
//     .then(function (response) {
//         let dailyReports = response.data[0]
//         let items = dailyReports.chemicals.concat(dailyReports.apparatus)
        
//         // <tbody class="tbody-dailyReports">
//         let tbody = document.querySelector(".tbody-dailyReports")
//         let tr = ""

//         items.forEach(item=>{
//             // <th scope="col">Item Name</th>
//             // <th scope="col">Quantity</th>
//             // <th scope="col">borrowed</th>
//             // <th scope="col">Actions</th>

//         tr+= `
//         <tr>
//         <td >${item.itemName}</td>
//         <td>${item.Qty + item.measurement}</td>
//         <td>${item.borrowed}</td>
//         <td><button>Print</button></td>
//       </tr>`

//         })
//         tbody.innerHTML = tr


//     })
//     .catch(function (error) {
//       console.log(error);
//     })

// }

