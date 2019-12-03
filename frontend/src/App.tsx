import React, { Component } from 'react';
//import Form from './Form';
import Login from './Login';
import io from 'socket.io-client';
interface Props {

}
interface State {
  rooms:string[]
}
export default class App extends Component<Props, State> {
  private socket:SocketIOClient.Socket
  constructor(props: Props) {
    super(props);
    this.state = {
      rooms:[]
    }

    this.socket = io('http://localhost:5000');
  }


  getCurrentUser =(currentUser:{username:String, login:Boolean})=>{
    console.log(currentUser) 
  }

  componentDidMount() {
    this.socket.on('rooms',(rooms:string[])=>{
         this.setState({rooms:rooms})
    })
  }
  

  render() {
    return (
      <div className="container-fluid" style={{display: 'flex', justifyContent: "center", marginTop: "5em"}}>
        <div className="shadow border border-light rounded">
          <Login getCurrentUser={this.getCurrentUser} rooms={this.state.rooms}/>
        </div>
      </div>
    );
  }
};
