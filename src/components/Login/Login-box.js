import React, { Component } from 'react'

import { connect } from 'react-redux'

import { Link } from 'react-router'

import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

import FormLogin from './Form-login'

import FormReg from './Form-register'

import { loginMaskAction } from '../../store/login/action'

class LoginBox extends Component {
    render() {
        const { dispatch, active } = this.props;

        const [showAndroid, showIos, showWeb, CSSTransitionGroupProps, nav, Form] = [
            () => dispatch({ type: loginMaskAction.ANDROID, display: 'block' }),
            () => dispatch({ type: loginMaskAction.IOS, display: 'block' }),
            () => dispatch({ type: loginMaskAction.WEB, display: 'block' }),
            {
                transitionName: 'transitionGroup',
                component: 'div',
                transitionLeave: false,
                transitionEnterTimeout: 300
            },
            (() => {

                let nav = [];

                [{ path: '/login/login', text: '登录' }, { path: '/login/reg', text: '注册' }].forEach((item, index) => {
                    nav.push(
                        <li key={index} className={active === index ? 'active' : ''}>
                            <Link to={item.path} >{item.text}</Link>
                        </li>
                    );
                });

                return nav;
            })(),
            (active === 0) ? <FormLogin></FormLogin> : <FormReg></FormReg>
        ]

        return (
            <div className="login-box box-shadow">
                <div className="head-photo box-shadow"></div>
                <ul className="login-nav">{nav}</ul>

                <CSSTransitionGroup {...CSSTransitionGroupProps}>
                    <div key={active} className='input-box'>
                        {Form}
                    </div>
                </CSSTransitionGroup>

                <div className="moblie">
                    <div className="main-title">
                        <span className="x-l"></span>
                        <span className="x-r"></span>
                        移动设备浏览
                    </div>

                    <ul className="clearfix">
                        <li onClick={showAndroid}>
                            {/* <img src="/image/android.png" alt="android" /> */}
                            <i className="iconfont icon-android moblie-icon"></i>
                            <div className="title">Android</div>
                        </li>
                        <li onClick={showIos}>
                            {/* <img src="/image/ios.png" alt="ios" /> */}
                            <i className="iconfont icon-ios moblie-icon"></i>
                            <div className="title">Ios</div>
                        </li>
                        <li onClick={showWeb}>
                            {/* <img src="/image/web.png" alt="web" /> */}
                            <i className="iconfont icon-web1 moblie-icon"></i>
                            <div className="title">web</div>
                        </li>
                    </ul>

                </div>
            </div>
        )
    }
}

export default connect((state, props) => {
    return {
        active: props.active
    }
})(LoginBox);