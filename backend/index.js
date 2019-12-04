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

let joinedRooms = []
//io is the connections objet to all clientsand. Socket is one single connection  
io.on('connection',(socket)=> {

    io.emit('rooms', rooms);
 
    io.emit('message-history',usersWithmessages); 
    socket.on('join_room',(room)=> {
        
        if(joinedRooms.length > 0) {

            for(let r of joinedRooms) {
                if(r.password === room.password && r.room === room.room)  {
                  
                    socket.join(room.room);
                    let roomId = Object.keys(socket.rooms);
                    socket.emit('join_room', {text:'success', id:roomId[0]});
                    return
                }
                
                if(r.password !== room.password && r.room !== room.room) {
                    joinedRooms.push(room);
                    socket.join(room).room;
                    let roomId = Object.keys(socket.rooms);
                    socket.emit('join_room',{text:'success', id:roomId[0]});
                    
               
                }
                if(r.password !== room.password && r.room === room.room){
                    socket.emit('join_room', {text: 'Failed',id:undefined});
                  
                }
            }
        } else {
            joinedRooms.push(room)
            socket.join(room.room);
            let roomId = Object.keys(socket.rooms);
        
            socket.emit('join_room', {text:'success', id:roomId[0]});
        }
        console.log(socket.rooms)
    });
    //Handle sign in and sign up
    socket.on('sign-in-sign-up',(userI)=>{
        let existUser = false;
        let isUser = checkUser(userI, existUser);
  
        //We check if it is not user even from the list
         
        if(!isUser) {
            usersWithmessages.push(userI);
            io.emit('sign-in-sign-up', 'success')
            return 
        } else if(isUser){
           
            io.emit('sign-in-sign-up', 'success')
            return 
        } else {
            io.emit('sign-in-sign-up', 'something else went wrong!')
            return 
        }
      
    });
    //Handle single message for single user with specefic group
    socket.on('single-message',(userInfo) => {
        console.log(userInfo, 'here')

   
        if(usersWithmessages.length > 0) {

            for(let user of usersWithmessages){

                if(user.username == userInfo.username  ){
                   
                    user.messages.push(userInfo.message)
                }
            } 
              
        };
        
        let testing = _.groupBy(usersWithmessages, (obj)=>{return obj.room });
        
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
                   
                    if(user.username === query.username ){
                        user.messages.push(data)
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

            if (user.username == userSend.username  ) {
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
