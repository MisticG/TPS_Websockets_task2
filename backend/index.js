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
        var response = require('./requestHandler')(query);

        //svar från requestHandler
        response.then((data)=>{
            messages.push(data)
            io.emit('RECEIVE_QUERY', data)
        }).catch((error)=>{
            io.emit('RECEIVE_QUERY','Det gick inte att hämta!')
        })
    })
})

const server = http.listen(5000, ()=>{
    console.log('server listen at port',server.address().port)
})
