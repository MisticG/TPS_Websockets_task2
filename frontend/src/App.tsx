import React, {Component} from 'react';
import Form from './Form'
import AutoComplete from './Autocomplete'

export default class App extends Component {
    render() {
        return (
              <div>
                  <Form/>
                  <AutoComplete />
              </div>
        )
    }
}
