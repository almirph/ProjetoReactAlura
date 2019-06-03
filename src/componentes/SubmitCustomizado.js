import React, { Component } from 'react';

export default class SubmitCustomizado extends Component {

    render() {
        return (
            <button type={this.props.type} className="pure-button pure-button-primary"> {this.props.nome} </button>
        );
    }
}