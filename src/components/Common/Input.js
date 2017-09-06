import React, { Component } from 'react'

import { connect } from 'react-redux'

class Input extends Component {
    render() {
        const { dispatch, action } = this.props;

        let attr = {...this.props}

        delete attr.dispatch;

        delete attr.action;

        return (
            <input {...attr} onChange={this.change} />
        )
    }
    
    change = ev => this.props.dispatch({type: this.props.action, value: ev.target.value});
}

export default connect((state, props) => {
    return {}
})(Input);