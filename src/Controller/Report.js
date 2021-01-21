const today1 = new Date().toISOString().slice(0, 10);

let monthAndYear = today1.split("-")
monthAndYear = monthAndYear[0] + "-" + monthAndYear[1]


const createDayStock = ()=>{
     axios.get(`http://localhost:3000/MonthlyReports?date_like=${monthAndYear}`)
    .then(async({data})=>{

        let apparatus;
        let chemicals;

        //fetching apparatus
        await axios.get(`http://localhost:3000/Apparatus`)
        .then(({data})=>{
            apparatus = data
        })
        .catch((ee)=> console.log(ee))

        //feting chemicals
        await axios.get(`http://localhost:3000/Chemicals`)
        .then(({data})=>{
            chemicals = data
        })
        .catch((ee)=> console.log(ee))

        //updating or creating report for that day
        axios.put(`http://localhost:3000/MonthlyReports/${data[0].id}`,{
            report: "wewewewew",
            date: today1,
            apparatus,
            chemicals
        })
        .then(({data})=>{
            
        })
        .catch(function (error) {
            console.log(error);
        }) 
        
        listDropDownMenu()

    })
    .catch(function (error) {
        console.log(error);
    })    
}


createDayStock()




const dropbtn =  document.querySelector(".dropbtn")
dropbtn.innerHTML ='Select date  ↓'


const listDropDownMenu = ()=>{

    const dropDown = document.querySelector(".dropdown-content")
    let dropDownContent= ""

    axios.get(`http://localhost:3000/MonthlyReports`)
    .then(({data})=>{
        
        data.forEach(report=>{
            dropDownContent+=`<a href="#" onClick="selecDate(${report.id}, '${report.date}')"> ${report.date} </a>`
        })

        dropDown.innerHTML = dropDownContent;
    })
    .catch(function (error) {
        console.log(error);
    }) 
}

// listDropDownMenu()

let targetPrint = {chemicals:[], apparatus: []};
let targetReportDate = ""

const selecDate = (id, date)=>{
   document.querySelector(".print-button").style.display = "inline"

    const reportTables = document.querySelector(".report-tables")
    const searchReport = document.querySelector(".search-report")


    reportTables.style.display ="block"
    searchReport.style.display ="none"

    targetPrint.chemicals= []
    targetPrint.apparatus= []
    
    targetReportDate = date

    dropbtn.innerHTML =date
    const dateOfReport = document.querySelectorAll(".dateOfReport")
    dateOfReport[0].innerHTML = date;
    dateOfReport[1].innerHTML = date;


    axios.get(`http://localhost:3000/MonthlyReports/${id}`)
    .then(({data})=>{
        const chemicals = data.chemicals;
        const apparatus = data.apparatus;
        let chemicalRows ="";
        let apparatusRows ="";
        const chemicalBody = document.querySelector(".tbody-chemicals-reports")
        const apparatusBody = document.querySelector(".tbody-appartus-reports")

        chemicals.forEach((chemical, index)=>{
            chemicalRows+=`<tr>
            <td> ${chemical.itemCode} </td>
            <td> ${chemical.itemName} </td>
            <td> ${chemical.Qty} </td>
            <td> ${chemical.borrowed} </td>
            <td> ${parseInt(chemical.Qty) + parseInt(chemical.borrowed)} </td>
            </tr>
            `
            targetPrint.chemicals.push([chemical.itemCode, chemical.itemName, chemical.Qty, chemical.borrowed,  parseInt(chemical.Qty) + parseInt(chemical.borrowed) ])
        })
        chemicalBody.innerHTML = chemicalRows

        apparatus.forEach((appa, index)=>{
            apparatusRows+=`<tr>
            <td> ${appa.itemCode} </td>
            <td> ${appa.itemName} </td>
            <td> ${appa.Qty} </td>
            <td> ${appa.borrowed} </td>
            <td> ${parseInt(appa.Qty) + parseInt(appa.borrowed)} </td>
            </tr>
            `
            targetPrint.apparatus.push([appa.itemCode, appa.itemName, appa.Qty, appa.borrowed, parseInt(appa.Qty) + parseInt(appa.borrowed) ])
        })
        apparatusBody.innerHTML = apparatusRows


    })
    .catch(function (error) {
        console.log(error);
    })
}




const printTable = ()=>{
    ipcRenderer.send("print:table", {data: targetPrint, date: targetReportDate});
}