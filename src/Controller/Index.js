const electron = require('electron')
const  axios = require('axios')
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

    where(index);

    links.forEach(link=>{
      
      link.style.background = "rgba(0, 0, 0, 0)";
    })
    link.style.background ="rgba(0, 0, 0, 0.144)";


  })
});

const where =(index)=>{
  localStorage.setItem('where', index)
  if(index == 0) {
    home.style.display = "block"
  }
  else if(index == 1) {
    transaction.style.display = "block"
  }
  else if(index == 2) {
    apparatus.style.display = "block"
  }
  else if(index == 3) {
    chemical.style.display = "block"
  }
  else if(index == 4) {
    report.style.display = "block"
  }
}
where(localStorage.getItem('where'))

// localStorage.setItem('where', 'home')
// alert(localStorage.getItem('myCat'))
