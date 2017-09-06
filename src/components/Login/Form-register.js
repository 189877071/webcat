import React, { Component } from 'react'

import { connect } from 'react-redux'

import Input from '../Common/Input'

import Verify from './verify'

import Tishi from './Tishi'

import { loginRegisterAction } from '../../store/login/action'

class FormReg extends Component {
    render() {

        const { dispatch, register } = this.props;

        const [
            user, usertext, usersuccess, email, emailtext, emailsuccess, pass, passtext, passsuccess, repass,
            repasstext, repasssuccess, verify, verifytext, verifysuccess, emailv, emailvtext, emailvsuccess, passbox, imgbox,
            emailvbox, submit, time, formsubmit, reverifyEmail
        ] = [
                {
                    value: register.user.value,
                    action: loginRegisterAction.USERONCHANGE,
                    onBlur() {
                        dispatch(loginRegisterAction.verifyuseroremail('user'));
                    },
                    onFocus() {
                        dispatch({ type: loginRegisterAction.USERALREADYREG, text: '', success: false });
                    }
                },
                register.user.text,
                register.user.success,
                {
                    value: register.email.value,
                    action: loginRegisterAction.EMAILONCHANGE,
                    onBlur() {
                        dispatch(loginRegisterAction.verifyuseroremail('email'));
                    },
                    onFocus() {
                        dispatch({ type: loginRegisterAction.EMAILALREADYREG, text: '', success: false });
                    }
                },
                register.email.text,
                register.email.success,
                {
                    value: register.pass.value,
                    action: loginRegisterAction.PASSONCHANGE,
                    onFocus() {
                        dispatch({ type: loginRegisterAction.UNVERIFYPASS, text: '', success: false });
                    }
                },
                register.pass.text,
                register.pass.success,
                {
                    value: register.repass.value,
                    action: loginRegisterAction.REPASSONCHANGE,
                    onFocus() {
                        dispatch({ type: loginRegisterAction.UNVERIFYREPASS, text: '', success: false });
                        dispatch({ type: loginRegisterAction.SHOWIMGBOX, h: 42 });
                    }
                },
                register.repass.text,
                register.repass.success,
                {
                    value: register.verify.value,
                    action: loginRegisterAction.VERIFYONCHANGE,
                    onFocus() {
                        dispatch({ type: loginRegisterAction.UNVERIFYVERIFY, text: '', success: false });
                    }
                },
                register.verify.text,
                register.verify.success,
                {
                    value: register.emailv.value,
                    action: loginRegisterAction.EMAILVONHANGE,
                    onFocus() {
                        dispatch({ type: loginRegisterAction.UNVERIFYEMAILV, text: '', success: false });
                    }
                },
                register.emailv.text,
                register.emailv.success,
                register.passbox,
                register.imgbox,
                register.emailvbox,

                register.submit,
                register.time,
                ev => {
                    ev.preventDefault();
                    dispatch(loginRegisterAction.submit())
                },
                () => dispatch(loginRegisterAction.reemail())
            ]

        const [uClass, eClass, pClass, repClass, evClass] = [
            setClass({ text: usertext, success: usersuccess }),
            setClass({ text: emailtext, success: emailsuccess }),
            setClass({ text: passtext, success: passsuccess }),
            setClass({ text: repasstext, success: repasssuccess }),
            setClass({ text: emailvtext, success: emailvsuccess }),
        ]

        return (
            <form noValidate onSubmit={formsubmit}>
                <p className={uClass}>
                    <Input type="text" className="shadow-input-style" placeholder="输入用户名" {...user} />
                    <Tishi>{usertext}</Tishi>
                </p>
                <p className={eClass}>
                    <Input type="email" className="shadow-input-style" placeholder="输入邮箱地址" {...email} />
                    <Tishi>{emailtext}</Tishi>
                </p>
                <div className="hidden" ref="hiddenP" style={{ height: passbox }}>
                    <p className={pClass}>
                        <Input type="password" className="shadow-input-style" placeholder="输入密码" {...pass} />
                        <Tishi>{passtext}</Tishi>
                    </p>
                    <p className={repClass}>
                        <Input type="password" className="shadow-input-style" placeholder="确认密码" {...repass} />
                        <Tishi>{repasstext}</Tishi>
                    </p>
                </div>

                <Verify q="regverify" h={imgbox} verify={verify} text={verifytext} success={verifysuccess} />

                <div className="hidden" ref="hiddenE" style={{ height: emailvbox }}>
                    <p className={evClass}>
                        <Input type="text" className="shadow-input-style email-verify" placeholder="输入邮箱验证码" ref="evInput" {...emailv} />
                        <span className="ev-right" ref="evr" onClick={reverifyEmail}>{time > 0 ? `${time > 9 ? time : '0' + time}秒` : '重新发送'}</span>
                        <Tishi>{emailvtext}</Tishi>
                    </p>
                </div>
                <p>
                    <button type="submit" className="shadow-input-style" >{submit}</button>
                </p>
                <p></p>
            </form>
        )
    }
    componentWillUnmount() {
        this.props.dispatch(loginRegisterAction.init());
    }
    componentDidMount() {
        setTimeout(() => {
            this.props.dispatch({ type: loginRegisterAction.SHOWPASSBOX, h: 84 });
        }, 300);
    }
}

export default connect((state, props) => {
    return {
        register: state.loginRegister
    }
})(FormReg);