import React, {Component} from 'react';

interface State {
    activeSuggestion: number
    filteredSuggestion: []
    showSuggestions: boolean
    userInput: String
}

export default class AutoComplete extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            activeSuggestion: 0,
            filteredSuggestion: [],
            showSuggestions: false,
            userInput: ''
            
        }
    }
    static propTypes = {}

    render() {
        return <div>Hello from AutoComplete</div>
    }
}