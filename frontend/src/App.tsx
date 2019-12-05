import React, { Component, CSSProperties } from 'react';
import io from 'socket.io-client';
import handleSlashCommand from './handleSlashCommand';
import AutoSeggestion from './AutoSeggestion';
import Login from './Login'
import Form from './Form';

interface currentUser {

}

interface State {

    message: any,
    thisMsg: String
    existGiphy: boolean,
    imgUrl: any
    messages: any,
    currentUserIsTyping: String,
    choosenSuggestionValue: String,
    joinedRoomOrNot:any,
    username: String,
    room: String,
    password: String,
    test:any

}

interface Props {

 

    
}


export default class App extends Component<Props, State> {
    private socket: SocketIOClient.Socket

    constructor(props: Props) {
        super(props);
        this.state = {
            message: '',
            thisMsg: '',
            existGiphy: false,
            imgUrl: '',
            messages: [],
            currentUserIsTyping: '',
            choosenSuggestionValue: '',
            joinedRoomOrNot:'',
            username: '',
            room: '',
            password: '',
            test:''
        }

        this.socket = io('http://localhost:5000');
    }
    
    getCurrentUser =(data:any)=>{
        /*
        ,()=>
        this.socket.emit('join_room', { room: this.state.room, password: this.state.password},()=>console.log(this.state, 'here is user info') 
         */
        this.setState({username:data.username, room:data.room, password:data.password},
            ()=>{this.socket.emit('sign-in-sign-up', 
            {username:data.username,
             room:data.room,
             password:data.password,
            messages:[]})})
        
        
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
        console.log(this.props);
        this.setState({
            currentUserIsTyping: '',
            message: ''
        }, () => this.socket.emit('typing', { username: '', room: this.state.room}));
       console.log(this.state.messages)
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

        this.socket.on('message-history', (dat: any) => {
        
            this.setState({ messages: dat}, () => { console.log(this.state.messages, 'message history') })
        });

        this.socket.on('single-message', (message: any) => {
         
            this.setState({ messages:message},()=>{console.log(this.state.messages)})
        });
        this.socket.on('RECEIVE_QUERY', (imgUrl: any) => {

            this.setState({ messages: this.state.messages, existGiphy: true, imgUrl: imgUrl })

        })

        this.socket.on('typing', ((username: string) => {
            
            this.setState({ currentUserIsTyping: username },()=>console.log(this.state.currentUserIsTyping))
        }))
        
       

        this.socket.on('sign-in-sign-up', (sucfai: string) => {
            
            this.setState({ joinedRoomOrNot: sucfai }, () => { console.log(this.state.joinedRoomOrNot) })
        })
    }

    keyPress = () => {
        this.socket.emit('typing', { username: this.state.username, room: this.state.room })
    }
    

    displayCurrentSender = ()=> {
       
        if (this.state.currentUserIsTyping !== '') {

            return <span>{this.state.currentUserIsTyping} + ' is typing.... '</span>
        }
    }

    
    displayLoginOrForm (){
        if(this.state.joinedRoomOrNot === 'success'){
            return <Form onchange={this.handOnChange} 
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
                
            return (<div>
        <h1>Sign in info: {this.state.joinedRoomOrNot}</h1>
                <Login getCurrentUser={this.getCurrentUser} room={this.state.room}/>
            </div>)
        }
    }
    

    render() {
        return (this.displayLoginOrForm())
    
}
}



const styleImg = {
    width: "20em",
    padding: "0.3em"
}
