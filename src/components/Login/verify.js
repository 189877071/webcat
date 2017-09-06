import React, { Component } from 'react'

import { url } from '../../config'

import Input from '../Common/Input'

import Tishi from './Tishi'

class Verify extends Component {
    componentWillMount() {
        this.state = {
            t: Date.now()
        }
    }
    cutVerify = () => {
        this.setState({
            t: Date.now()
        })
    }
    render() {
        const { h, q, verify, text, success } = this.props;

        const vClass = 'clearfix ' + setClass({text: text, success: success});

        return (
            <div className="hidden" style={{ height: h }}>
                <p className={vClass}>
                    <Input
                        className="shadow-input-style verify-input"
                        type="text"
                        placeholder="输入验证码"
                        {...verify}
                    />
                    <img
                        src={`${url.imgVerifyURL}?q=${q}&t=${this.state.t}`}
                        ref="img"
                        alt="验证码"
                        className="shadow-input-style verify-img"
                        onClick={this.cutVerify}
                    />
                    <Tishi>{text}</Tishi>
                </p>
            </div>
        )
    }
}

export default Verify;