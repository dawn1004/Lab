function getTransHistory(){
    axios.get('http://localhost:3000/History?_sort=id&_order=desc')
    .then(function (response) {
        console.log(response)
        let tr="";
        let tbody = document.querySelector(".tbody-transHistory-item");

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
                onclick="ViewTransactionItemHistory(${item.id})"
                class="btn btn-success">View Items</button>
                </td>
            </tr>`;
        })
  
        tbody.innerHTML = tr;
  
      })
      .catch(function (error) {
        console.log(error);
      })
}

getTransHistory()


function ViewTransactionItemHistory(target){
    const modal = document.querySelector(".modal-itemShow-bg")
    modal.style.display = "flex"


    axios.get(`http://localhost:3000/History/${target}`)
    .then(function (response) {
        let {data} = response

        let element = `
            <div class="close-modal-itemShow"
            onclick="transHistoryModalListing()"
            >X</div>
            <p> Student Name: <b> ${ data.student_name } </b> </p>
            <p> Student Number: <b> ${ data.student_num } </b> </p>
            <p class="modaling-title"> Chemicals: </p>
            <ul class="history-chems-list"></ul>
            <p class="modaling-title"> Apparatus: </p>
            <ul class="history-appa-list"></ul>
        `
        document.querySelector(".itemShow-modal").innerHTML = element;

        const chemList = document.querySelector(".history-chems-list")
        data.chemicals.forEach(chems=>{
            axios.get(`http://localhost:3000/Chemicals/${chems.id}`)
            .then(function (response) { 
                // console.log(response.data.itemName)
                chemList.innerHTML+=`<li> ${chems.borrowed+response.data.measurement } of ${response.data.itemName} </li>`
            })
            .catch(function (error) {
                console.log(error);
            })
        })

        const appaList = document.querySelector(".history-appa-list")
        data.apparatus.forEach(appa=>{
            axios.get(`http://localhost:3000/Apparatus/${appa.id}`)
            .then(function (response) { 
                appaList.innerHTML+=`<li>${appa.borrowed+response.data.measurement } of ${response.data.itemName} </li>`
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



const transHistoryModalListing = ()=>{
    const modal = document.querySelector(".modal-itemShow-bg")
    modal.style.display = "none"
}