const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


app.get('/',(req,res)=>{
    res.send('Hejjj')
})

io.on('connection',(socket)=>{
    socket.emit('hello','World')
})

const server = http.listen(5000, ()=>{
    console.log('server listen at port',server.address().port)
})