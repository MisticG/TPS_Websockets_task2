import React, { Component, CSSProperties } from 'react';
import io from 'socket.io-client';
import handleSlashCommand from './handleSlashCommand';
import  AutoSeggestion from './AutoSeggestion'
interface currentUser {

}

interface State {

  message: any,
  thisMsg: String
  existGiphy: boolean,
  imgUrl: any
  messages: any,
  currentUserIsTyping:String,
  choosenSuggestionValue:String

}

interface Props {
  username:String,
  room:String
 
}


export default class Form extends Component<Props, State> {
  private socket: SocketIOClient.Socket

  constructor(props: Props) {
    super(props);
    this.state = {
      message: '',
      thisMsg: '',
      existGiphy: false,
      imgUrl: '',
      messages: [],
      currentUserIsTyping:'',
      choosenSuggestionValue:''


    }

    this.socket = io('http://localhost:5000');
  }


  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let msg = this.state.message;
    if(msg.startsWith("/")) {
         handleSlashCommand.call(this.state.thisMsg, {username:this.props.username, room:this.props.room, msg:this.state.message});
        return 
      } else {
       
        this.socket.emit('single-message', {username:this.props.username, message:this.state.message, room:this.props.room});
      }
        this.setState({
          currentUserIsTyping:'',
          message:''
      },()=>this.socket.emit('typing', {username:'', room:this.props.room}))


    
  }

  handOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [event.target.name]: event.target.value } as Pick<State, any>)
  
  }

  getValueFromAutoSuggestion = (data:{value:string, label:string})=>{
    this.setState({
      choosenSuggestionValue:data.value,
      message:data.value
    })
  }
  displayAutoSuggestion = ()=>{
    let message = this.state.message.substring(0,1);
    if(message === '/') {
     
      return <AutoSeggestion getvalue= {this.getValueFromAutoSuggestion}/>
    }
  }
   

  componentDidMount() {
    this.setupSocketEventListeners();
  }

  componentWillUnmount() {
    this.socket.close();
  }

  setupSocketEventListeners = () => {
   
    this.socket.on('message-history', (dat: string) => {
   
      this.setState({ messages: dat })
    })

      this.socket.on('single-message', (messages: any) => {
      console.log('new message received: ', messages)
      this.setState({ messages: messages })
      })
      this.socket.on('RECEIVE_QUERY', (imgUrl: any) => {
      //this.state.messages.push(imgUrl)
        console.log(imgUrl, 'img url')

      this.setState({messages: this.state.messages, existGiphy: true, imgUrl: imgUrl})
      console.log(this.state.messages)
      })

      this.socket.on('typing',((username:string)=>{
        this.setState({currentUserIsTyping:username})
      }))
      this.socket.emit('join_room', this.props.room);
  }

  keyPress = ()=>{
    this.socket.emit('typing', {username:this.props.username, room:this.props.room})
  }
  displayMessageHistory() {
    if(this.state.messages.length > 0 ) {
      return this.state.messages.map((message:{username:string, id:number,room:string, messages:string[]})=>{
      
        if(message.messages.length > 0){
          
          return message.messages.map((msg:string)=> {
            let tr = msg.substring(0,4)
            if (tr === 'http') {
              return<img src={msg} alt="chosen or random gifs or/of cats" style={styleImg}/>
    
              //else return  an ordinary string message
            } 
              return <li>{msg + ' is from' + message.username}</li>
          })
        }
      })
    } 
  }

  displayCurrentSender (){
    if( this.state.currentUserIsTyping !=='' ) {

      return <span>{this.state.currentUserIsTyping+ ' is typing.... '}</span>
    }
  }
 
  



  render() {
    return (
      <div>
        <ul>
            {this.displayMessageHistory()
            }

        </ul>
          {this.displayCurrentSender()}
          <h1>{'user: '+ this.props.username}</h1>
          <h1>{'Room: '+ this.props.room}</h1>

        <form onSubmit={this.handleSubmit} style={formStyle}>
        <div style={autoSuggestion}>

          {this.displayAutoSuggestion()}
        </div>
        <label htmlFor="text" style={labelStyle}>
          Message:
              <input style={inputStyle} type="text" name="message"  value={this.state.message} onChange={this.handOnChange} onKeyPress={this.keyPress}/>
        </label>
          <input type="submit" value="Send"/>
        </form>
      </div>

    );
  }


}
const formStyle: CSSProperties = {
  position: "fixed",
  width: "100%",
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#9e9e4e",
  padding: "2em",
  alignItems: "center"

}
const labelStyle: CSSProperties = {

  width: "70%"
}
const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.5em"
}
const buttonStyle: CSSProperties = {
  width: "30%",
  padding: "1em",
  marginTop: "0.5em"
}

const autoSuggestion ={
  width:"70%"
}

const styleImg = {
  width:"10em"
}