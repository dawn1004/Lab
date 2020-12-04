
function getStockHistory(){
    axios.get('http://localhost:3000/stockHistory?_sort=id&_order=desc')
    .then(function (response) {
        console.log(response)
        let tr="";
        let tbody = document.querySelector(".tbody-addingStock-item");

        response.data.forEach(item=>{
            tr+=`<tr>
                  <td> ${item.date} </td>
                  <td >${item.itemCode}</td>
                  <td >${item.itemName}</td>
                  <td>
                    <span>${item.stockAdded}</span><span class="measurement">${item.measurement}</span>
                  </td>
              </tr>`;
        })
  
        tbody.innerHTML = tr;
  
      })
      .catch(function (error) {
        console.log(error);
      })
}

getStockHistory()