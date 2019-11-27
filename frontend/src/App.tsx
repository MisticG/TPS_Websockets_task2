import React, {Component} from 'react';
//import io from 'socket.io-client';
import ChatBox from './chatBox';
interface State{
  hello:String
}

interface Props{

}
export default class App extends Component<Props, State> {
  /*constructor(props:Props){
    super(props);
    this.state={
      hello:''
    }
  }

  componentDidMount(){
    this.test()
  }
  test = ()=>{
    const socket = io('http://localhost:5000');
    socket.on('hello',(dat:any)=>{
        this.setState({hello:dat})
    })
    
   
  };*/
  render(){
    return (
      <div>
        <ChatBox/>
      </div>
      
    );
  }
};
