const fetch = require('node-fetch');
const axios = require('axios').default;
module.exports = function(query) {
const keys = require('./keys');


    //let finald
    /*fetch (keys.url + query.query + keys.key+ '&limit=1')
    .then(res => res.json())
    .then((data)=>{s
        console.log(data)
        //finald = data
        //sendData(data)
        //return data
    }).catch(err => console.error(err));

    /*async function sendData(data) {
       await data;
       return data
    }*/

async function sendData() {
  
    try{
        
        let response = axios(keys.url + query+ keys.key+ '&limit=1');
        let finalResponse = await response;

        if(finalResponse.status === 200) {
           // console.log(finalResponse.data.data[0])
            return finalResponse.data.data[0].images;
        } else {
            return finalResponse.status + 'Error: '+ finalResponse.statusText
        }


    }catch(error){
        console.log(error)
    }


   // return re
}
return sendData() 
    
}