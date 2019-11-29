import React from 'react';
import io from 'socket.io-client';
import handleSlashCommand from './handleSlashCommand';

interface State {
  username: string;
  message: string;
  messages: any;
  returnMessages: any;
  this: String;
  existGiphy: boolean
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
        returnMessages:'',
        this: '',
        existGiphy: false
    };  

    this.sendMessage = this.sendMessage.bind(this);

    };

    private socket: any = io('localhost:5000');

    sendMessage (event: React.FormEvent) {
        event.preventDefault();
        let msg = this.state.message;

        if (msg.trim() === "") return;

        if(msg.startsWith("/")) {
            handleSlashCommand.call(this.state.this, msg);

            this.setState(
                {message: ""}
            )
            return;
        }

        this.socket.emit('SEND_MESSAGE',msg);
        this.setState({message: ''});
    }

    componentDidMount() {
        this.showGiphyImg()
    }

    showGiphyImg() {
        this.socket.on('RECEIVE_QUERY', (imgUrl: any) => {
            this.setState({returnMessages: imgUrl, existGiphy: true})
            console.log(this.state.returnMessages)
        })

        
    }

    

    showMessage = () => {
        this.socket.on('RECEIVE_MESSAGE', (data: any)=>{
            this.setState({returnMessages: data})
        })

        if (this.state.existGiphy === false) {
            return (
                <li>{this.state.returnMessages}</li>
            )
        }else {
            return (
                <li>
                    <h1>hey</h1>
                    <img src={this.state.returnMessages} alt="chosen giphy gif"/>
                </li>
            )
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
                                <div>
                                    
                                    {this.showMessage()}
                                </div>
                                <div>
                                    <ul>
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
        )
    }
}