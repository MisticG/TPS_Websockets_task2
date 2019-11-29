// Initiate app to be a function handler
//const express = require('express');
const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

// Create server and supply a function handler (app)
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let messages = []  
//io is the connections objet to all clientsand socket is one single connection  
io.on('connection',(socket)=>{

    io.emit('message-history',messages)
    
    socket.on('single-message',(msg)=>{
        messages.push(msg)
        io.emit('single-message',messages)
    })

    socket.on('SEND_QUERY', function(query) {
        console.log(query, 'query in socket')
        var request = require('./requestHandler')( query);
        request.then((imgs)=>{
            let imgUrl = imgs.downsized_medium.url
            messages.push(imgUrl)
            io.emit('RECEIVE_QUERY', imgUrl)
            //console.log(imgs)
        }).catch((error)=>{
            io.emit('RECEIVE_QUERY','Det gick inte att hämta!')
        })
    })
    
})

const server = http.listen(5000, ()=>{
    console.log('server listen at port',server.address().port)
})
 

// route handler
/*io.on('connection', function (socket) {
    socket.on('SEND_QUERY', function(query) {
        console.log(query, 'query in socket')
        var request = require('./requestHandler')( query);
        request.then((imgs)=>{
            let imgUrl = imgs.downsized_medium.url
            io.emit('RECEIVE_QUERY', imgUrl)
            //console.log(imgs)
        }).catch((error)=>{
            io.emit('RECEIVE_QUERY','Det gick inte att hämta!')
        })
    })*/

    //console.log(socket.id);
    //socket.on('SEND_MESSAGE', function(data) {
        //console.log(data)
        /*let test = data.substring(0,1);
        if(test === "/") {
            console.log(test)
            let tr =  require('./requestHandler')(app, data);
        } else {

            
        }*/
        //io.emit('RECEIVE_MESSAGE', data);
    
        //gör en forloop. kolla om det finns en slash. Om det finns så skicka det i en request. Substring = 6
        //gör en fil för anrop och en fil för keys. Använd express.
    //})
//})