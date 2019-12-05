import React, { Component, CSSProperties } from 'react';
import io from 'socket.io-client';
import Form from './Form';


interface State {
    username: String,
    password: string,
    room: any,
    login: Boolean,
    isUserOrNot:any
    
}
interface Props {
    room:String
    getCurrentUser:(data:any)=>void
}
export default class Login extends Component<Props, State>{
    private socket: SocketIOClient.Socket
    constructor(props: Props) {
        super(props);
        this.state = {
            username: '',
            room: '',
            login: false,
            password: '',
            isUserOrNot:''
        
        }

        
        this.socket = io('http://localhost:5000');
    }

    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let senderInfo = { username: this.state.username, message: '', messages: [], room: this.state.room, password: this.state.password };

       // this.socket.emit('join_room', { room: this.state.room, password: this.state.password });
      

        this.setState({ login: true },()=> this.props.getCurrentUser(this.state));

    }

    handOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [event.target.name]: event.target.value } as any)
    }

    getChoosenRoom = (room: String) => {
        this.setState({ room: room }, () => { console.log(this.state.room) })

    }


    componentWillUnmount() {
        this.socket.close();
    }


    componentDidMount() {
       

    
    }  
   

    render() {
      
       return (
            <div style={{ margin: "5em" }}>
               
                <form onSubmit={this.handleSubmit} >
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputText4"><b>Choose room:</b></label>
                            <input type="text" className="form-control" value={this.state.room}placeholder="room" name="room" onChange={this.handOnChange} required />
                        </div><br/>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputPassword4"><b>Choose password:</b></label>
                            <input type="password" className="form-control" id="inputPassword4" placeholder="Your password" name="password" onChange={this.handOnChange} required />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputText4"><b>Choose nickname:</b></label>
                            <input type="text" className="form-control" placeholder="Nickname" name="username" onChange={this.handOnChange} required />
                        </div>
                        
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <button type="submit" className="btn btn-info">Join chat!</button>
                    </div>
                </form>
            </div>
        )
    }
}

