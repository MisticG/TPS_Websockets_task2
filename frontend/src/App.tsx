import React, { Component } from 'react';
import io from 'socket.io-client';
import handleSlashCommand from './handleSlashCommand';
import AutoSeggestion from './AutoSeggestion';
import Login from './Login'
import Form from './Form';

interface State {

    message: String,
    thisMsg: String
    existGiphy: boolean,
    imgUrl: String,
    messages: [{username:String, password:String, messages:[{text:String, username:String}], room:String}],
    currentUserIsTyping: String,
    choosenSuggestionValue: String,
    joinedRoomOrNot:String,
    username: String,
    room: String,
    password: String
}

export default class App extends Component<{}, State> {
    private socket: SocketIOClient.Socket

    constructor(props: {}) {
        super(props);
        this.state = {
            message: '',
            thisMsg: '',
            existGiphy: false,
            imgUrl: '',
            messages:  [{username:'', password:'', messages:[{text:'', username:''}], room:''}],
            currentUserIsTyping: '',
            choosenSuggestionValue: '',
            joinedRoomOrNot:'',
            username: '',
            room: '',
            password: '',
        }

        this.socket = io('http://localhost:5000');
    }
    
    getCurrentUser =(data:{username:string |String, room: string, password:string})=>{
 
        this.setState({username:data.username, room:data.room, password:data.password},
            () => {this.socket.emit('sign-in-sign-up', {
                username:data.username,
                room:data.room,
                password:data.password,
                messages:[]}
            )}
        )
    }

    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let msg = this.state.message;

        if (msg.startsWith("/")) {
            handleSlashCommand.call(this.state.thisMsg, { username: this.state.username, 
                room: this.state.room, msg: this.state.message, password: this.state.password });

        } else {

            this.socket.emit('single-message', { username: this.state.username, message: this.state.message, room: this.state.room, password:this.state.password });
        }
       
        this.setState({
            currentUserIsTyping: '',
            message: ''
        }, () => this.socket.emit('typing', { username: '', room: this.state.room}));
    }

    handOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       
        this.setState({ [event.target.name]: event.target.value } as Pick<State, any>)

    }

    getValueFromAutoSuggestion = (data: { value: string, label: string }) => {
        this.setState({
            choosenSuggestionValue: data.value,
            message: data.value
        })
    }

    displayAutoSuggestion = () => {
        let message = this.state.message.substring(0, 1);
        if (message === '/') {
            return <AutoSeggestion getvalue={this.getValueFromAutoSuggestion} />
        }
    }

    componentDidMount() {
        this.setupSocketEventListeners();
    }

    componentWillUnmount() {
        this.socket.close();
    }

    setupSocketEventListeners = () => {
      
        this.socket.on('message-history', (dat: [{username:String, password:String, messages:[{text:String, username:String}], room:String}]) => {
            this.setState({ messages: dat })
        });

        this.socket.on('single-message', (message:  [{username:String, password:String, messages:[{text:String, username:String}], room:String}]) => {
            this.setState({ messages:message})
        });

        this.socket.on('RECEIVE_QUERY', (imgUrl: String) => {
            this.setState({ messages: this.state.messages, existGiphy: true, imgUrl: imgUrl })
        });

        this.socket.on('typing', (username: string) => {
            this.setState({ currentUserIsTyping: username })
        })
        
        this.socket.on('sign-in-sign-up', (sucfai: string) => {
            this.setState({ joinedRoomOrNot: sucfai })
        })
    }

    keyPress = () => {
        this.socket.emit('typing', { username: this.state.username, room: this.state.room })
    }
    

    displayCurrentSender = ()=> {
        if (this.state.currentUserIsTyping !== '') {
            return <span>{this.state.currentUserIsTyping} is typing.... </span>
        }
    }

    
    displayLoginOrForm (){
        if(this.state.joinedRoomOrNot === 'success'){
            return <Form 
                        onchange={this.handOnChange} 
                        onsubmit={this.handleSubmit} 
                        displayautosug={this.displayAutoSuggestion}
                        messages={this.state.messages}
                        keyPress={this.keyPress}
                        displayCurrentSender={this.displayCurrentSender}
                        username={this.state.username}
                        room={this.state.room}
                        message={this.state.message}
                    />
        } else {
                
            return (
                <div className="container-fluid">
                    <div className="border shadow rounded border-light container" style={{display: "flex", justifyContent: "center", marginTop: "5em"}}>
                        <div style={{textAlign: "center", margin: "3em"}}>
                            <h1>Welcome to our chat</h1>
                            <h3>Login status: {this.state.joinedRoomOrNot} </h3>
                            
                            <Login getCurrentUser={this.getCurrentUser} room={this.state.room}/>
                        </div>
                    </div>  
                </div>
            )
        }
    }
    render() {
        return (this.displayLoginOrForm())
    }
}
