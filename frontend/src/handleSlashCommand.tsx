import io from 'socket.io-client';
const socket: any = io('http://localhost:5000')

export default function handleSlashCommand(this: String, message: String) {
    console.log(message)
    const cmd = message.split(" ")[0]
    let query = message.slice(cmd.length)

    if(cmd === "/giphy") {
        query = 'giphy' + query
        socket.emit('SEND_QUERY', query)
    } else if(cmd === "/bored") {
        query = 'bored' + query
        socket.emit('SEND_QUERY', query)
    } else {
        alert(`${cmd} is not a valid command`)
        return;
    }
}
