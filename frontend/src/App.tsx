import React, { Component } from 'react';
import Form from './Form';
import Login from './Login';
interface Props {

}
interface State {

}
export default class App extends Component<Props, State> {



  setCurrentUser =(currentUser:{username:String, login:Boolean})=>{
    console.log(currentUser)
  }

  render() {
    return (
      <div>
        <Login  setCurrentUser={this.setCurrentUser}/>

      </div>
    );
  }
};
