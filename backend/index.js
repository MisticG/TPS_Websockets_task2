const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
 

app.get('/',(req,res)=>{
    res.send('Hejjj')
})  

let messages = []  
//io is the connections objet to all clientsand socket is one single connection  
io.on('connection',(socket)=>{

    io.emit('message-history',messages)
    
    socket.on('single-message',(msg)=>{
        messages.push(msg)
        io.emit('single-message',msg)
    })
    
})

const server = http.listen(5000, ()=>{
    console.log('server listen at port',server.address().port)
})