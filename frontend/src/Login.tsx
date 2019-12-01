import React, { Component, CSSProperties } from 'react';
import io from 'socket.io-client';
import Form from './Form';
interface State {
  username: String,
  login:Boolean,


}
interface Props {
  setCurrentUser:(data:State)=>void
}
export default class Login extends Component<Props, State>{
  private socket:SocketIOClient.Socket
  constructor(props: Props) {
    super(props);
    this.state = {
      username: '',
      login:false,

     

    }

    this.socket = io('http://localhost:5000');
  }


  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let senderInfo ={username:this.state.username,message:'', messages:[]}
    this.socket.emit('single-message', senderInfo);
    this.setState({login:true},()=>this.props.setCurrentUser(this.state))
  }

  handOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    this.setState({username:event.target.value })

  }



  renderUser =()=>{
    if(this.state.login === true && this.state.username !== '') {
      return <Form username={this.state.username}/>
    } else  {
      return  (
        <div style={formContainer}>
       
          <form  style={loginForm}onSubmit={this.handleSubmit} >
            <label htmlFor="text" > Get a nickname:
                  <input  style={inputWidth} type="text" name="username" onChange={this.handOnChange} />
  
            </label>
            <input  type="submit" value="Get a nickname!" />
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