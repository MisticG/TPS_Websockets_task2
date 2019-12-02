import React, { Component, CSSProperties } from 'react';
import io from 'socket.io-client';

interface currentUser {

}
interface State {

  message: String,
  messages: any,
  currentUser:String,
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
      messages: [],
      currentUser:''

    }

    this.socket = io('http://localhost:5000');
  }


  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    this.socket.emit('single-message', {username:this.props.username, message:this.state.message, room:this.props.room});
    this.setState({currentUser:''})
  }

  handOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    this.setState({ [event.target.name]: event.target.value } as Pick<State, any>)

  } 

  componentDidMount() {
    this.setupSocketEventListeners()
  }
  
  componentWillUnmount() {
     this.socket.close()
  }

  setupSocketEventListeners = () => {

    this.socket.on('message-history', (dat: string) => {
   
      this.setState({ messages: dat }, () => { console.log(this.state.messages, 'here is state') })
    })
    
    this.socket.on('single-message', (users: any) => {
      console.log(users);
      this.setState({ messages: users})
   
    })
    this.socket.on('user',((username:string)=>{
      this.setState({currentUser:username})
    }))

    this.socket.on('nice game',(msg:string)=>{
      console.log(msg)
      this.setState({message:msg},()=>{console.log(this.state.message)})
    })

  }

  displayMessageHistory() {
    if(this.state.messages.length > 0 ) {
      return this.state.messages.map((message:{username:string, id:number,roo:string, messages:string[]})=>{
      
        if(message.messages.length > 0){
          
          return message.messages.map((msg:string)=> {
          return <li>{msg} from {message.username}</li>
          })
        }
      })
    }
  }

  displayCurrentSender (){
    if( this.state.currentUser !=='' ) {
    
    return <span>{this.state.currentUser+ ' is typing.... '}</span>
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
        <label htmlFor="text" style={labelStyle}>
          Message:
              <input style={inputStyle} type="text" name="message" onChange={this.handOnChange} />
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
  backgroundColor: "green",
  padding: "1em",
  alignItems: "center"

}
const labelStyle: CSSProperties = {

  width: "70%"
}
const inputStyle: CSSProperties = {
  width: "100%",
  padding: "o.5em"
}
const buttonStyle: CSSProperties = {
  width: "30%",
  padding: "1em",
  marginTop: "0.5em"
}