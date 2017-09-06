import React, { Component } from 'react'

import { connect } from 'react-redux'

import { loginMaskAction } from '../../store/login/action'

class MoblieApp extends Component {
    render() {
        const { title, src, dispatch } = this.props;

        const hide = () => dispatch(loginMaskAction.init());

        return (
            <div className="moblie-box box-shadow mask-common-connect-box" ref="box">
                <h1>
                    <span>{title}</span>
                    <a href="javascript:;" title="关闭" onClick={hide}>
                        <i className="iconfont icon-iconfontcha"></i>
                    </a>
                </h1>
                <div className="app-qr">
                    <img src={src} alt={title} className="box-shadow" />
                </div>
            </div>
        )
    }
    componentDidMount() {
        setMarginTop(this.refs.box);
    }
}

export default connect((state, props) => {
    return {}
})(MoblieApp);