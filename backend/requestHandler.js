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
    const api = query.split(" ")[0]
    const q = query.split(" ")[1]
    console.log(api, 'api')

    //console.log(q, 'query')
    let response;
    try{
        if(api === 'giphy') {
        //console.log(query, 'requesthandler')
            response = axios(keys.giphyUrl + q + keys.giphyKey+ '&limit=1');
        } else if (api === 'bored') {
            response = axios(keys.boredUrl);
        }
        let finalResponse = await response;

        if(finalResponse.status === 200) {
            if(api === 'giphy') {
           // console.log(finalResponse.data.data[0])
            return finalResponse.data.data[0].images.downsized_medium.url;
            } else if(api === 'bored') {
                console.log(finalResponse.data.activity)
                return finalResponse.data.activity;
            }
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