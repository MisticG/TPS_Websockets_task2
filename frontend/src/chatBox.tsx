import React from 'react';
import io from 'socket.io-client';

interface State {
  username: string;
  message: string;
  messages: any;
  returnMessages:any
}

interface Props {

}

export default class ChatBox extends React.Component<Props, State> {
    constructor(props: Props){
    super(props);

    this.state = {
        username: '',
        message: '',
        messages: [],
        returnMessages:''
    };  

    this.sendMessage = this.sendMessage.bind(this);

};

sendMessage (event: React.FormEvent) {
    var socket = io('localhost:5000');
    event.preventDefault();
    let msgs = this.state.messages;
    msgs.push(this.state.message);
    socket.emit('SEND_MESSAGE',msgs);
    this.setState({message: ''});
}

socket: any = io('localhost:5000');

showMessage = () => {
    this.socket.on('RECEIVE_MESSAGE', (data: any)=>{
        this.setState({returnMessages: data})
    })

    if (this.state.returnMessages.length > 0) {
        return this.state.returnMessages.map((msg: String)=>{
            return <li>{msg}</li>
        })
    }
}

render() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-4">
                    <div className="card">
                        <div className="card-body">
                            <div className="card-title">Global Chat</div>
                            <hr/>
                            <div className="messages">
                                <ul>
                                   {this.showMessage()}
                                </ul>
                            </div>
                        </div>
                        <div className="footer">
                            <input type="text" placeholder="Username" className="form-control" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} />
                            <br/>
                            <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}/>
                            <br/>
                            <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}
}