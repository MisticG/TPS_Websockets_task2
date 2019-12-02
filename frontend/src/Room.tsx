import React, { Component, CSSProperties } from 'react';
import io from 'socket.io-client';
interface Props {
    rooms:string[]
    getChoosenRoom:(room:String)=>void
}
interface State {
    choosenRoom:String


}
export default class Room extends Component<Props, State> {
  
    constructor(props: Props) {
        super(props);
        this.state = {
          choosenRoom:"a",
      
      
    
    
        }
      

    }

  
    addRoom = (event: React.MouseEvent<HTMLLIElement, MouseEvent>)=>{
        
        this.setState({choosenRoom:event.currentTarget.innerHTML},()=>{
          
            this.props.getChoosenRoom(this.state.choosenRoom);
        });
        
    }
  
  

    displayAllRooms = ()=> {
        let rooms = this.props.rooms;
        if(rooms.length > 0 ) {
            return rooms.map((room:string)=>{
            return <li onClick={this.addRoom}>{room}</li>
            })
            
        }
    }

  render() {
    return (
        <div style={roomContainer}>
  <h4> your default room is {this.state.choosenRoom}!</h4>
        <ul style={roomStyle}> 

        {this.displayAllRooms()}
        </ul>
        </div>

    );
  }

};
const roomContainer:CSSProperties = {
    display:"block",
    margin:"auto",
    width:"50%",
    position:"relative",
    backgroundColor:"#b7d1d2"
}
const roomStyle:CSSProperties = {
    display:"flex",
    flexDirection:"row",
    justifyItems:"center",
    listStyleType:"none",
    justifyContent:"space-around",
    marginBottom:"2em",
    
}