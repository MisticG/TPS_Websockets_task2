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


let usersWithmessages = []  

let joinedRooms = []
//io is the connections objet to all clientsand. Socket is one single connection  
io.on('connection',(socket)=> {

 
    
    //Handle sign in and sign up
    io.emit('message-history',usersWithmessages);
    socket.on('sign-in-sign-up',(userI)=>{
     
        let existUser = 3;
        let isUser = checkUser(userI, existUser);
      
        if(isUser === 3) {
            usersWithmessages.push(userI);
            socket.join(userI.room);
            io.emit('sign-in-sign-up', 'success');

            
        } else if(isUser === 404){
            io.emit('sign-in-sign-up', 'Fail');
        }else if(isUser === 1){
         
            socket.join(userI.room);
            io.emit('sign-in-sign-up', 'success')

        } else {
           
            io.emit('sign-in-sign-up', 'something else went wrong!')
         
        }
      
    });
    //Handle single message for single user with specefic group
    socket.on('single-message',(userInfo) => {
      
      
        
        if( usersWithmessages.length > 0) {
           
            for(let user of usersWithmessages){
    
                if(user.room == userInfo.room){
                  
                    
                   user.messages.push({text:userInfo.message, username:userInfo.username});
                  
                
                }
            } 
        } 
      
    
        
        let testing = _.groupBy(usersWithmessages, (obj)=>{return obj.room });
        console.log(testing);
        console.log(testing['a'][0].messages)
        io.sockets.in(userInfo.room).emit('single-message', testing[userInfo.room]);
     
      
    });
    
    //Handle when someone is typing
    socket.on('typing',(usermsg) => {

        socket.broadcast.in(usermsg.room).emit('typing', usermsg.username);
    })


    //Handle api request
    socket.on('SEND_QUERY', function(query) {
     
        var response = require('./requestHandler')(query.query);
        //response from requestHandler
        response.then((data)=>{

            //Check new user or exsit user
            let existUserTest = false;
            let existUser = checkUser(query, existUserTest);
            if(existUser){
                for(let user of usersWithmessages){
                   
                    if(user.room === query.room ){
                        user.messages.push({text:data, username:query.username})
                    }
                }
            } 
            let allGroups = _.groupBy(usersWithmessages, (obj)=>{return obj.room });
            io.emit('RECEIVE_QUERY', data)
            io.emit('single-message',allGroups[query.room]);
          

        }).catch((error)=>{
            io.emit('RECEIVE_QUERY','Det gick inte att hämta!'+ error)
        })
        
    })
})


function checkUser(userSend, existUser){
    if(usersWithmessages.length > 0) {

        for (user of usersWithmessages) {
            //when a user has access to room
            if (user.password === userSend.password && user.room === userSend.room ) {
                existUser = 1
            }
            
            if(user.room === userSend.room && user.password !== userSend.password
                || user.room !== userSend.room && user.password === userSend.password ){
                existUser= 404
             
                
            }
        }
       
    } else {
        
        existUser = 3
    }
    return existUser
}

const server = http.listen(5000, ()=>{
    console.log('server listen at port',server.address().port)
})
