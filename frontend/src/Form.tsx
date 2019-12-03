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
    
      } else {
       
        this.socket.emit('single-message', {username:this.props.username, message:this.state.message, room:this.props.room});
      }
        this.setState({
          currentUserIsTyping:'',
          message:''
      },()=>this.socket.emit('typing', {username:'', room:this.props.room})
    )    
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
      return this.state.messages.map((message: {username: string, id: number, room: string, messages: string[]}) => {
        console.log(message)
        if(message.messages.length > 0){
          
          return message.messages.map((msg:string)=> {
            let tr = msg.substring(0,4)
            if (tr === 'http') {
              return <div><img src={msg} alt="chosen or random gifs or/of cats" style={styleImg}/></div>
    
              //else return  an ordinary string message
            } 
              return <li style={{flex: '0 0 auto', padding: "0.3em"}}><b>{message.username}:</b> {msg}</li>
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
      <div style={{margin: "3em", display: "flex", flexDirection: "row" }}>
        <div style={{backgroundColor: "#515BB3", padding: "1em"}}>
          <h3>{'Room: '+ this.props.room}</h3>
          <h3>{'user: '+ this.props.username}</h3> 
        </div>
        <div>
        <div style={{height: "30em", width: "40em", overflow: "auto", margin:"0 0 1em 1em"}}>
          <ol style={{display: "flex", flexDirection: "column-reverse"}}>
              {this.displayMessageHistory()}
          </ol>
            {this.displayCurrentSender()}
        </div>
        <div>
          <form style={{marginLeft: "1em"}} onSubmit={this.handleSubmit}>
            <div className="form-row">
              <div style={formStyle} className="form-group col-md-4">
                <label htmlFor="text">
                  <input type="text" className="form-control" id="inputPassword2" placeholder="Type here..." name="message"  value={this.state.message} onChange={this.handOnChange} onKeyPress={this.keyPress}/>
                </label>
              </div>
              <div style={formStyle} className="form-group col-md-4">
                <button type="submit" className="btn btn-info mb-2">Send message</button>
              </div>
              <div className="form-group col-md-4" style={autoSuggestion}>
                {this.displayAutoSuggestion()}
              </div>
            </div>
          </form>
          </div>
        </div>
      </div>

    );
  }
}

const formStyle: CSSProperties = {
  marginBottom: 0
}
/*
const labelStyle: CSSProperties = {
  width: "70%"
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.5em"
}*/

/*const buttonStyle: CSSProperties = {
  width: "30%",
  padding: "1em",
  marginTop: "0.5em"
}*/

const autoSuggestion ={
  width:"70%",
  marginBottom: 0
}

const styleImg = {
  width:"20em",
  padding: "0.3em"
}