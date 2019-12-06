import React, { Component, CSSProperties } from 'react';
import io from 'socket.io-client';

interface State {}

interface Props {
    onchange:(event: React.ChangeEvent<HTMLInputElement>) => void,
    onsubmit:(event: React.FormEvent<HTMLFormElement>) => void,
    displayautosug:any,
    messages:any,
    keyPress:any,
    displayCurrentSender:any
    username:String,
    room:String
    message:any
}

export default class Form extends Component<Props, State> {
    private socket: SocketIOClient.Socket

    constructor(props: Props) {
        super(props);
        this.state = {}
        
        this.socket = io('http://localhost:5000')
    }

    displayMessageHistory = () => {
        if (this.props.messages !== null && this.props.messages !== undefined && this.props.messages.length > 0) {

            return this.props.messages.map((message: { username: string, id: number, room: string, messages:any[] }) => { 
                if ( message.messages !== null && message.messages !== undefined && message.messages.length > 0) {
                    return message.messages.map((msg: any) => {
                    if(msg !== undefined || msg !== null ) {
                        let tr = msg.text.substring(0, 4)
                        if (tr === 'http') {
                            return <div><b>{msg.username}:</b><img src={msg.text} alt="chosen or random gifs or/of cats" style={styleImg} /></div>
                        }
                        return <li style={{ flex: '0 0 auto', padding: "0.3em" }}><b>{msg.username}:</b> {msg.text}</li>
                    }
                    })
                }
            })
            
        }
    }

    render() {
        return (
            <div>
            <div className="container rounded shadow" style={{display: "flex", marginTop: "5em", padding: "1em", }}>
                <div className="rounded" style={{ backgroundColor: "#515BB3", padding: "1em" }}>
                    <h3>{'Room: ' + this.props.room}</h3>
                    <h4>{this.props.username}</h4>
                </div>
                <div>
                    <div style={{ height: "30em", width: "40em", overflow: "auto", transform: "rotate(180deg)", direction: "rtl", margin: "0 0 1em 1em" }}>
                        <div style={{transform: "rotate(180deg)", direction: "ltr"}}>
                            <ul>
                                {this.displayMessageHistory()}
                            </ul>
                            {this.props.displayCurrentSender()}
                        </div>
                    </div>
                    <div>
                
                    <form style={{ marginLeft: "1em" }} onSubmit={this.props.onsubmit}>
                        <div className="form-row">
                            <div style={formStyle} className="form-group col-md-4">
                                <label htmlFor="text">
                                    <input type="text" className="form-control" id="inputPassword2" placeholder="Type here..." name="message" value={this.props.message} onChange={this.props.onchange} onKeyPress={this.props.keyPress} />
                                </label>
                            </div>
                            <div style={formStyle} className="form-group col-md-4">
                                <button type="submit" className="btn btn-info mb-2">Send message</button>
                            </div>
                            <div className="form-group col-md-4" style={autoSuggestion}>
                                {this.props.displayautosug()}
                            </div>
                        </div>
                    </form>
                </div>
                </div>
                </div>
                
            </div>
        );
    }
}

const formStyle: CSSProperties = {
    marginBottom: 0
}

const autoSuggestion = {
    width: "70%",
    marginBottom: 0
}

const styleImg = {
    width: "20em",
    padding: "0.3em"
}

