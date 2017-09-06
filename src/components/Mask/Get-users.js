import React, { Component } from 'react'

import { connect } from 'react-redux'

import { loginMaskAction } from '../../store/login/action'

class GetUsers extends Component {
    render() {
        return (
            <div className="get-users" ref="box">
                <div className="close" onClick={this.close}><i className="iconfont icon-iconfontcha"></i></div>
                <div>获取演示用户：<a target="_break" href={this.props.url}>{this.props.url}</a></div>
            </div>
        )
    }
    componentDidMount() {
        setMarginTop(this.refs.box);
    }
    close = () => {
        this.props.dispatch({type: loginMaskAction.GETUSERS, onoff: false});
    }
}

export default connect(state => {
    return {
        url: state.loginMask.getusersUrl
    }
})(GetUsers)