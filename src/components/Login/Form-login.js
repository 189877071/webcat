import React, { Component } from 'react'

import { connect } from 'react-redux'

import Tishi from './Tishi'

import Input from '../Common/Input'

import Verify from './verify'

import { loginIndexAction, loginMaskAction } from '../../store/login/action'


class FormLogin extends Component {

    render() {

        const { dispatch, login } = this.props;

        const [user, usertext, usersuccess, pass, passtext, passsuccess, delayed, init, showUpdatePass, submit, verify, verifytext, verifysuccess, imgbox] = [
            {
                value: login.user.value,
                action: loginIndexAction.USERONCHANGE,
                onFocus() {
                    dispatch({ type: loginIndexAction.STTVERIFYUSER, text: '', success: false });
                }
            },
            login.user.text,
            login.user.success,
            {
                value: login.pass.value,
                action: loginIndexAction.PASSONCHANGE,
                onFocus() {
                    dispatch({ type: loginIndexAction.SETVERIFYPASS, text: '', success: false });
                    dispatch({ type: loginIndexAction.SHOWIMGVERIFY, h: 42 });
                }
            },
            login.pass.text,
            login.pass.success,
            {
                checked: login.delayed,
                onChange(ev) {
                    dispatch(loginIndexAction.delayed(ev.target.checked));
                }
            },
            () => dispatch(loginIndexAction.init()),
            () => dispatch({ type: loginMaskAction.UPDATEPASS, display: 'block' }),
            ev => {
                ev.preventDefault();
                dispatch(loginIndexAction.submit());
            },
            {
                value: login.verify.value,
                action: loginIndexAction.VERIFYONCHANGE,
                onFocus() {
                    dispatch({ type: loginIndexAction.SETVERIFYIMG, text: '', success: false });
                }
            },
            login.verify.text,
            login.verify.success,
            login.imgbox
        ];

        const [uClass, pClass] = [
            setClass({ text: usertext, success: usersuccess }),
            setClass({ text: passtext, success: passsuccess })
        ];

        return (
            <form noValidate onSubmit={submit}>
                <p className={uClass}>
                    <Input type="text" className="shadow-input-style" placeholder="输入用户名或邮箱" {...user} />
                    <Tishi>{usertext}</Tishi>
                </p>

                <p className={pClass}>
                    <Input type="password" className="shadow-input-style" placeholder="输入密码" {...pass} />
                    <Tishi>{passtext}</Tishi>
                </p>

                <Verify q="loginverify" text={verifytext} success={verifysuccess} h={imgbox} verify={verify} />

                <p><button type="submit" className="shadow-input-style">登{' '}录</button></p>

                <p>
                    <input type="checkbox" className="checkbox" id="jizhumima" {...delayed} />
                    <label htmlFor="jizhumima">记住密码</label>
                    <a className="wangjimima" href="javascript:;" onClick={showUpdatePass}>忘记密码</a>
                </p>
            </form>
        )
    }
    componentWillUnmount() {
        // this.props.init();
    }
}

export default connect((state, props) => {
    return {
        login: state.loginIndex,
    }
})(FormLogin);