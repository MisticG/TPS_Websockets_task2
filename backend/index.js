// Initiate app to be a function handler
const app = require('express')();

// Create server and supply a function handler (app)
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// route handler
app.get('/', (req, res) => {
    res.send('Hejjj')
})

io.on('connection', function (socket) {
    //console.log("A user connected...");
    //socket.emit('chat message', "a user connected...")
    /*socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });*/

    console.log(socket.id);
    socket.on('SEND_MESSAGE', function(data) {
        //gör en forloop. kolla om det finns en slash. Om det finns så skicka det i en request. Substring = 6
        //gör en fil för anrop och en fil för keys. Använd express.
        io.emit('RECEIVE_MESSAGE', data);
    })
})


const server = http.listen(5000, ()=>{
    console.log('server listen at port',server.address().port)
})

/*const app = require('express')();
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
})*/