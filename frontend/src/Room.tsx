import React, { Component, CSSProperties } from 'react';
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

    addRoom = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        
        this.setState({choosenRoom:event.currentTarget.innerHTML},() => {
          
            this.props.getChoosenRoom(this.state.choosenRoom);
            //alert('you choose room: '+ this.state.choosenRoom)
        });    
    }

    displayAllRooms = ()=> {
        let rooms = this.props.rooms;
        if(rooms.length > 0 ) {
            return rooms.map((room:string)=>{
                return <div>
                    <li style={{padding: '0 3em'}}><button className="btn btn-success btn-lg" onClick={this.addRoom}>{room.toUpperCase()} </button></li>
                </div>
            })
        }
    }

    render() {
        return (
            <div className="container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <h2> Welcome to our Chat App! {/*{this.state.choosenRoom}!*/}</h2>
                <div style={{marginTop: "1em"}}>
                    <h4>Choose room:</h4>
                </div>
                <div>
                    <ul style={roomStyle}> 
                        {this.displayAllRooms()}
                    </ul>
                </div>
            </div>

        );
    }
};

/*const roomContainer:CSSProperties = {
    display:"block",
    margin:"auto",
    width:"50%",
    position:"relative",
    backgroundColor:"#b7d1d2"
}*/

const roomStyle:CSSProperties = {
    display:"flex",
    flexDirection:"row",
    justifyItems:"center",
    listStyleType:"none",
    justifyContent:"space-around",
    margin:"1em 0 2em 0",
}