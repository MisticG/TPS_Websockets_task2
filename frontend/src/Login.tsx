import React, { Component, CSSProperties } from 'react';
import io from 'socket.io-client';
import Form from './Form';
import Room from './Room';

interface State {
  username: String,
  password:string,
  room:String,
  login:Boolean,


}
interface Props {
  getCurrentUser:(data:State)=>void,
  rooms:string[]
}
export default class Login extends Component<Props, State>{
  private socket:SocketIOClient.Socket
  constructor(props: Props) {
    super(props);
    this.state = {
      username: '',
      room:'a',
      login:false,
      password:''
  
     

    }

    this.socket = io('http://localhost:5000');
  }


  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let senderInfo ={username:this.state.username,message:'', messages:[], room:this.state.room, password:this.state.password};
    console.log(senderInfo, 'here is sender')
    this.socket.emit('single-message', senderInfo);
    this.setState({login:true},()=>this.props.getCurrentUser(this.state))
  }

  handOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
 
    this.setState({[event.target.name]:event.target.value } as any)

  }

  getChoosenRoom = (room:String)=>{
    this.setState({room:room},()=>{ console.log(this.state.room)})
 
  }

  renderUser =()=>{
    if(this.state.login === true && this.state.username !== '') {
      return <Form username={this.state.username} room={this.state.room}/>
    } else  {
      return  (
        <div style={formContainer}>
        <Room rooms={this.props.rooms} getChoosenRoom={this.getChoosenRoom}/>
       
          <form  style={loginForm}onSubmit={this.handleSubmit} >
            <label htmlFor="text" > Get a nickname:
                  <input  style={inputWidth} type="text" name="username" onChange={this.handOnChange} required/>
  
            </label>
            <label htmlFor="text" > Get a password:
                  <input  style={inputWidth} type="password" name="password" onChange={this.handOnChange} required/>
  
            </label>
            <input  type="submit" value="Sign in!" />
          </form>
        </div>
  
      )
    }
  }

  render() {
    return(this.renderUser())
  }


}

const loginForm:CSSProperties = {
  position:"relative",
  marginTop:"9em",
  display:'flex',
  flexDirection:'column',
  width:"50%",
  margin:"auto"

}
const formContainer:CSSProperties = {
  marginTop:"10em"
}
const inputWidth:CSSProperties = {
  width:"50%"
}