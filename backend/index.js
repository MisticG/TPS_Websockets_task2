const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
 


let rooms = ['Room 1', 'Room 2', 'Room 3']
let usersWithmessages = []  

//io is the connections objet to all clientsand socket is one single connection  
io.on('connection',(socket)=> {
    //io.sockets.in(userInfo.room)
    io.emit('message-history',usersWithmessages);
    io.emit('rooms', rooms)
 
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
        socket.join(userInfo.room)
   
        socket.broadcast.to(userInfo.room).emit('user', userInfo.username);

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