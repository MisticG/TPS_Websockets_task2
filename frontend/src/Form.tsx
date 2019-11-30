import React, { Component, CSSProperties } from 'react';
import io from 'socket.io-client';
import handleSlashCommand from './handleSlashCommand';

interface State {
  username: String,
  message: String,
  messages: any
  thisMsg: String
  existGiphy: boolean,
  imgUrl: any
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
      messages: [],
      thisMsg: '',
      existGiphy: false,
      imgUrl: ''
    }

    this.socket = io('http://localhost:5000');
  }


  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let msg = this.state.message;
      if (msg.trim() === "") return;

      if(msg.startsWith("/")) {
          handleSlashCommand.call(this.state.thisMsg, msg);

          this.setState(
            {message: ""}
          )
          return;
      }

    this.socket.emit('single-message', msg);
    this.setState({message: ''});
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

    this.socket.on('single-message', (messages: any) => {
      console.log('new message received: ', messages)
      //this.state.messages.push(message)
      this.setState({ messages: messages })
      // this.state.messages.push(message)
    })
    this.socket.on('RECEIVE_QUERY', (imgUrl: any) => {
      this.state.messages.push(imgUrl)
      this.setState({messages: this.state.messages, existGiphy: true, imgUrl: imgUrl})
      console.log(this.state.messages)
  })
  }

  displayMessageHistory() {
    //if there are any messages
    if (this.state.messages.length > 0)  {
      return this.state.messages.map((message: string) => {

        //if the string contains http aka image from giphy
        let msg = message.substring(0, 4)
        if (msg === 'http') {
          return <img src={message} alt="chosen giphy gif"/>
        } 
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