import React, { Component } from 'react'

import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

class Tishi extends Component {
    render() {
        return (
            <CSSTransitionGroup
                transitionName="transitionGroup"
                transitionLeave={false}
                transitionEnterTimeout={300}
                style={this.props.style}
                className="set-tihis"
            >
                <i key={this.props.children}>{this.props.children}</i>
            </CSSTransitionGroup>
        )
    }
}

export default Tishi;