import React, { Component, CSSProperties } from 'react';
import io from 'socket.io-client';

interface State {
  username: String,
  message: String,
  messages: any
}
interface Props {

}
export default class Form extends Component<Props, State>{
  private socket: SocketIOClient.Socket

  constructor(props: Props) {
    super(props);
    this.state = {
      message: '',
      username: '',
      messages: []

    }

    this.socket = io('http://localhost:5000');
  }


  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.socket.emit('single-message', this.state.message);
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

    this.socket.on('single-message', (message: any) => {
      console.log('new message received: ', message)
      this.state.messages.push(message)
      this.setState({ messages: this.state.messages})
     // this.state.messages.push(message)
    })

  }

  displayMessageHistory(){
    if(this.state.messages.length > 0){
      return this.state.messages.map((message:string)=>{
      return <li>{message}</li>
      })
    }
  }

  render() {
    return (
      <div>
        <ul>
            {this.displayMessageHistory()}
        </ul>


        <form onSubmit={this.handleSubmit} style={formStyle}>
          <label htmlFor="text" style={labelStyle}> Username:
                <input style={inputStyle} type="text" name="username" onChange={this.handOnChange} />

          </label>
          <label htmlFor="text" style={labelStyle}>
            Message:
                <input style={inputStyle} type="text" name="message" onChange={this.handOnChange} />
          </label>
          <input style={buttonStyle} type="submit" value="Skicka" />
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