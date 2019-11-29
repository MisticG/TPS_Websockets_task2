import io from 'socket.io-client';
const socket: any = io('http://localhost:5000')

export default function handleSlashCommand(this: String, message: String) {
    console.log(message)
    const cmd = message.split(" ")[0]
    const query = message.slice(cmd.length)
    console.log(cmd, 'this is a cmd')
    console.log(query, 'this is a query')

    if(cmd !== "/giphy") {
        console.log(cmd, 'this is a cmd')
        console.log(query, 'this is a query')
        alert(`${cmd} is not a valid command`)
        return;
    } else {
    sendQuery();
    }
    
    function sendQuery() {
        console.log(query)
        socket.emit('SEND_QUERY', query);
    }

    /*ReceiveQuery();
    function ReceiveQuery() {
        socket.on('RECEIVE_QUERY', (imgUrl: any) => {
            console.log(imgUrl)
        })
    }*/  
}

//var socket: any = io('http://localhost:5000')

    /*fetch('/api/?search=' + query, {
        method: 'GET',
    }
    ).then(data => {
        console.log(data)
        socket.emit('SEND_QUERY', data);
    }).catch(err =>
        console.error(err)*/
