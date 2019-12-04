import io from 'socket.io-client';
const socket: any = io('http://localhost:5000')

export default function handleSlashCommand(this: String, message: {username:String, room:String, msg:String, password:String}) {
    const cmd = message.msg.split(" ")[0]
    let query = message.msg.slice(cmd.length)
    if(cmd === "/giphy") {
        console.log(message, 'here is message')
        query = 'giphy' + query
        socket.emit('SEND_QUERY', {query: query, username: message.username, room: message.room, password:message.password})
    } else if(cmd === "/bored") {
        query = 'bored' + query
        socket.emit('SEND_QUERY', {query: query, username: message.username, room: message.room,password:message.password} )
    } else if (cmd === "/cat") {
        query = 'cat' + query
        socket.emit('SEND_QUERY', {query: query, username: message.username, room: message.room, password:message.password})
    } else {
        alert(`${cmd} is not a valid command`)
        return;
    }
}
 