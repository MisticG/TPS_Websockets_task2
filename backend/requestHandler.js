const axios = require('axios').default;

module.exports = function(query) {
    const keys = require('./keys');

    async function sendData() {
        const api = query.split(" ")[0]
        const req = query.split(" ")[1]

        let response;
        try{
            if(api === 'giphy') {
                response = axios(keys.giphyUrl + req + keys.giphyKey+ '&limit=1');
            } else if (api === 'bored') {
                response = axios(keys.boredUrl);
            } else if (api === 'cat') {
                response = axios(keys.catUrl);
            }
            let finalResponse = await response;

            if(finalResponse.status === 200) {
                if (api === 'giphy') {
                return finalResponse.data.data[0].images.downsized_medium.url;
                } else if (api === 'bored') {
                    return finalResponse.data.activity;
                } else if (api === 'cat') {
                    return finalResponse.data[0].url
                }
            } else {
                return finalResponse.status + 'Error: '+ finalResponse.statusText
            }

        } catch(error) {
            console.log(error)
        }
    }
    return sendData() 
}