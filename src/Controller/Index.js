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

