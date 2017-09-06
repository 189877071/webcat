import './style.scss'

import React, { Component } from 'react'

import { connect } from 'react-redux'

import CSSTransitionGrout from 'react-transition-group/CSSTransitionGroup'

class MaskBox extends Component {
    render() {
        
        const { setStyle, children } = this.props;

        return (
            <CSSTransitionGrout
                transitionName="transitionGroup"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
                component="div"
            >
                <div
                    className="mask"
                    style={{ display: setStyle }}
                    key={setStyle}
                >
                    {children}
                </div>
            </CSSTransitionGrout>
        )
    }
}

export default connect((state, props) => {
    return {
        children: props.children,
        setStyle: props.setStyle
    }
})(MaskBox);