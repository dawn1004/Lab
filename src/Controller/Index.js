const electron = require('electron')
const  axios = require('axios')


const add = ()=>{
    axios.post('http://localhost:3000/students')
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    })
}

//Navigations

const links = document.querySelectorAll(".nav-links li")

links.forEach((link, index) => {
  link.addEventListener('click',()=>{
    const home = document.querySelector("#home");
    const transaction = document.querySelector("#transaction");
    const apparatus = document.querySelector("#apparatus");
    const chemical = document.querySelector("#chemical");
    const report = document.querySelector("#report");
    home.style.display = "none"
    transaction.style.display = "none"
    apparatus.style.display = "none"
    chemical.style.display = "none"
    report.style.display = "none"

    if(index == 0) home.style.display = "block"
    else if(index == 1) transaction.style.display = "block"
    else if(index == 2) apparatus.style.display = "block"
    else if(index == 3) chemical.style.display = "block"
    else if(index == 4) report.style.display = "block"

    links.forEach(link=>{
      
      link.style.background = "rgba(0, 0, 0, 0)";
    })
    link.style.background ="rgba(0, 0, 0, 0.144)";


  })
});