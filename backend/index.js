// Initiate app to be a function handler
//const express = require('express');
const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

// Create server and supply a function handler (app)
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const _ = require('underscore');

let rooms = ['a', 'b', 'c']
let usersWithmessages = []  

//io is the connections objet to all clientsand socket is one single connection  
io.on('connection',(socket)=> {

    io.emit('rooms', rooms);
    
    //Handle joing room and history for specefic group
    socket.on('join_room',(room)=>{    
        socket.join(room);
        let allGroups = _.groupBy(usersWithmessages, (obj) => {return obj.room });
        io.sockets.in(room).emit('message-history', allGroups[room]);   
    })

    //Handle single message for single user with specefic group
    socket.on('single-message',(userInfo) => {

        let existUser = false;
        let isUser = checkUser(userInfo, existUser);
     
        if(!isUser) {
            usersWithmessages.push(userInfo);
            
        }
        if(isUser){
            for(let user of usersWithmessages){
                
                if(user.username === userInfo.username && userInfo.message !== ''){
                    user.messages.push(userInfo.message)
                }
            }
        } 
        let allGroups = _.groupBy(usersWithmessages, (obj)=>{return obj.room });
        io.sockets.in(userInfo.room).emit('single-message', allGroups[userInfo.room]);
    });

    //Handle when someone is typing
    socket.on('typing',(usermsg) => {
        socket.broadcast.in(usermsg.room).emit('typing', usermsg.username);
    })

    //Handle api request
    socket.on('SEND_QUERY', function(query) {
        console.log(query, 'here is query')
        var response = require('./requestHandler')(query.query);
        //response from requestHandler
        response.then((data)=>{

            console.log(response, 'query response here')
            let existUserTest = false;
            let existUser = checkUser(query, existUserTest);
            if(existUser){
                for(let user of usersWithmessages){
                   
                    if(user.username === query.username){
                        user.messages.push(data)
                    }
                }
            } 
          
            let allGroups = _.groupBy(usersWithmessages, (obj)=>{return obj.room });
            io.emit('RECEIVE_QUERY', data)
            io.sockets.in(query.room).emit('single-message',allGroups[query.room]);

        }).catch((error)=>{
            io.emit('RECEIVE_QUERY','Det gick inte att hämta!'+error)
        })
        
    })
})


function checkUser(userSend, existUser){
    if(usersWithmessages.length > 0) {

        for (user of usersWithmessages) {

            if (user.username == userSend.username) {
                existUser = true
            }
        }
     
    } else {
        existUser = false
    }
    return existUser
}

const server = http.listen(5000, ()=>{
    console.log('server listen at port',server.address().port)
})
