const today1 = new Date().toISOString().slice(0, 10);

let monthAndYear = today1.split("-")
monthAndYear = monthAndYear[1] + "-" + monthAndYear[2]

axios.get(`http://localhost:3000/MonthlyReports?date_like=${monthAndYear}`)
.then(({data})=>{
    if(data.length == 0 ){
        axios.post(`http://localhost:3000/MonthlyReports`,{
            report: "somethimg",
            date: today1
        })
        .then(({data})=>{
        })
        .catch(function (error) {
            console.log(error);
        })    
    }

})
.catch(function (error) {
    console.log(error);
})