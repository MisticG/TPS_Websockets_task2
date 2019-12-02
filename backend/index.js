const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
 


let rooms = ['a', 'b', 'c']
let usersWithmessages = []  

//io is the connections objet to all clientsand socket is one single connection  
io.on('connection',(socket)=> {

    io.emit('rooms', rooms);
    io.emit('message-history',usersWithmessages);
  
 
    socket.on('join_room',(room)=>{

        socket.join(room);
    })
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
    
        socket.broadcast.in(userInfo.room).emit('user', userInfo.username);
        io.sockets.in(userInfo.room).emit('single-message', usersWithmessages);
    
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