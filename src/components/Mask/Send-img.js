import React, { Component } from 'react'

class SendImg extends Component {
    render() {
        return (
            <div className="register-ok" ref="box">
                <h1>图片正在发送中请稍后……</h1>
            </div>
        )
    }

    componentDidMount() {
        setMarginTop(this.refs.box);
    }
}

export default SendImg;