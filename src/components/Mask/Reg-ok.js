import React, { Component } from 'react'

import { connect } from 'react-redux'

import { history } from '../../config'

class RegOk extends Component {
    render() {
        const { t } = this.props;
        return (
            <div className="register-ok" ref="box">
                <h1>注册成功 <span>{t > 9 ? t : '0' + t} 秒</span> 后转跳……</h1>
            </div>
        )
    }

    componentDidMount() {
        setMarginTop(this.refs.box);
    }
}

export default connect(state => {
    return {
        t: state.loginRegister.jump
    }
})(RegOk);