import React from 'react';
import Select from 'react-select';
 
const options = [
  { value: '/giphy', label: '/giphy' },
  { value: '/cat', label: '/cat' },
  { value: '/bored', label: '/bored' },
];

interface Props{
    getvalue:(data:{value:string, label:string})=>void
}
interface State{
    selectedOption:any
}
 
export default class AutoSeggestion extends React.Component<Props, State> {
  state = {
    selectedOption: null,
  };
  handleChange = ((selected:any)=>{
    this.props.getvalue(selected)
  });
  render() {
    const { selectedOption } = this.state;
 
    return (
      <Select
        value={selectedOption}
        onChange={this.handleChange}
        options={options}
      />
    );
  }
}