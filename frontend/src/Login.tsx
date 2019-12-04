import React, { Component, CSSProperties } from 'react';
import io from 'socket.io-client';
import Form from './Form';
import Room from './Room';

interface State {
    username: String,
    password: string,
    room: String,
    login: Boolean,
    isUserOrNot: String,
    tr:String

}
interface Props {

    rooms: string[]
}
export default class Login extends Component<Props, State>{
    private socket: SocketIOClient.Socket
    constructor(props: Props) {
        super(props);
        this.state = {
            username: '',
            room: 'A',
            login: false,
            password: '',
            isUserOrNot: '',
            tr: ''
        }

        this.socket = io('http://localhost:5000');
    }


    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let senderInfo = { username: this.state.username, message: '', messages: [], room: this.state.room, password: this.state.password };

       // this.socket.emit('join_room', { room: this.state.room, password: this.state.password });
        this.socket.emit('sign-in-sign-up', senderInfo);

        this.setState({ login: true });
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
        this.socket.on('sign-in-sign-up', (sucfai: string) => {
            this.setState({ isUserOrNot: sucfai }, () => { console.log(this.state.isUserOrNot) })
        })

    
    }  
    isJoined =(text:string)=>{
        this.setState({tr:text}, ()=>{console.log(this.state.isUserOrNot)})
    }
    renderUser = () => {
        if (this.state.isUserOrNot === 'success' && this.state.login === true) {
            return <Form username={this.state.username} room={this.state.room} password={this.state.password}  isjoined={this.isJoined }/>
        } else {
            return (
                <div style={{ margin: "5em" }}>
                    <h5>Join room info: {this.state.tr}</h5>
                    <h5>Sign in info: {this.state.isUserOrNot}</h5>
                    <Room rooms={this.props.rooms} getChoosenRoom={this.getChoosenRoom} />

                    <form onSubmit={this.handleSubmit} >
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputText4"><b>Choose nickname:</b></label>
                                <input type="text" className="form-control" placeholder="Nickname" name="username" onChange={this.handOnChange} required />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4"><b>Choose password:</b></label>
                                <input type="password" className="form-control" id="inputPassword4" placeholder="Your password" name="password" onChange={this.handOnChange} required />
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

    render() {
        return (this.renderUser())
    }
}

