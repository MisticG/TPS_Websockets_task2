import React, {Component} from 'react';
import io from 'socket.io-client';
import ChatBox from './chatBox';

interface State{
  hello:String
}
import React, { Component } from 'react';
import Form from './Form'

export default class App extends Component {

}
export default class App extends Component<Props, State> {
  constructor(props:Props){
    super(props);
    this.state={
      hello:''
    }
  }
  componentDidMount(){
    this.test()
  }
  socket: any = io('http://localhost:5000')

  test = ()=>{
    this.socket.on('hello',(dat:any)=>{
        //this.setState({hello:dat})
        console.log('test')
    })
    
   
  };
  render(){
    return (
      <div>
        {this.state.hello}
        <ChatBox/>

  render() {
    return (
      <div>
        <Form />
      </div>
      
    );
  }
};
};
