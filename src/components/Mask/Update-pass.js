import React, { Component } from 'react'

import { connect } from 'react-redux'

import Input from '../Common/Input'

import Tishi from '../Login/Tishi'

import { loginMaskAction } from '../../store/login/action'

class UpdatePass extends Component {
    render() {

        const { dispatch, updatepass } = this.props;

        const [
            hide, sendVerify, submit, emailSubmit, submitText, emailtext, emailsuccess, email,
            passtext, passsuccess, pass, repasstext, repasssuccess, repass, verifytext, verifysuccess, verify
        ] = [
                () => dispatch(loginMaskAction.init()),
                ev => {
                    ev.preventDefault();
                    $(ev.target).find('input').blur();
                    dispatch(loginMaskAction.sendEmailVerify());
                },
                ev => {
                    ev.preventDefault();
                    $(ev.target).find('input').eq(0).blur();
                    $(ev.target).find('input').eq(1).blur();
                    $(ev.target).find('input').eq(2).blur();
                    dispatch(loginMaskAction.updateSubmit());
                },
                updatepass.emailSubmit,
                updatepass.submit,
                updatepass.email.text,
                updatepass.email.success,
                {
                    value: updatepass.email.value,
                    action: loginMaskAction.UPDATEPASSEMAILONCHANGE,
                    onFocus() {
                        dispatch({ type: loginMaskAction.UPDATEPASSEMAILTEXT, text: '', success: false });
                    }
                },
                updatepass.pass.text,
                updatepass.pass.success,
                {
                    value: updatepass.pass.value,
                    action: loginMaskAction.UPDATEPASSPASSONCHANGE,
                    onFocus() {
                        dispatch({ type: loginMaskAction.UPDATEPASSPASSTEXT, text: '', success: false });
                    }
                },
                updatepass.repass.text,
                updatepass.repass.success,
                {
                    value: updatepass.repass.value,
                    action: loginMaskAction.UPDATEPASSREPASSONCHANGE,
                    onFocus() {
                        dispatch({ type: loginMaskAction.UPDATEPASSREPASSTEXT, text: '', success: false });
                    }
                },
                updatepass.verify.text,
                updatepass.verify.success,
                {
                    value: updatepass.verify.value,
                    action: loginMaskAction.UPDATEPASSVERIFYONCHANGE,
                    onFocus() {
                        dispatch({ type: loginMaskAction.UPDATEPASSVERIFYTEXT, text: '', success: false });
                    }
                }
            ];

        const [eClass, pClass, reClass, vClass] = [
            setClass({ text: emailtext, success: emailsuccess }),
            setClass({ text: passtext, success: passsuccess }),
            setClass({ text: repasstext, success: repasssuccess }),
            setClass({ text: verifytext, success: verifysuccess }),
        ];

        return (
            <div className="update-password box-shadow mask-common-connect-box" ref="box">
                <h1>
                    <span>找回密码</span>
                    <a href="javascript:;" title="关闭" onClick={hide}>
                        <i className="iconfont icon-iconfontcha"></i>
                    </a>
                </h1>

                <div>
                    <form noValidate onSubmit={ev => sendVerify(ev)}>
                        <p className={eClass}>
                            <Input type="email" className="shadow-input-style" placeholder="输入邮箱地址" {...email} />
                            <Tishi>{emailtext}</Tishi>
                        </p>
                        <p>
                            <button type="submit" className="shadow-input-style">{emailSubmit}</button>
                        </p>
                    </form>
                </div>

                <div className="henxian"></div>

                <div>
                    <form noValidate onSubmit={ev => submit(ev)}>
                        <p className={pClass}>
                            <Input type="password" className="shadow-input-style" placeholder="输入新密码" {...pass} />
                            <Tishi>{passtext}</Tishi>
                        </p>
                        <p className={reClass}>
                            <Input type="password" className="shadow-input-style" placeholder="确认密码" {...repass} />
                            <Tishi>{repasstext}</Tishi>
                        </p>
                        <p className={vClass}>
                            <Input type="text" className="shadow-input-style" placeholder="输入邮箱验证码" {...verify} />
                            <Tishi>{verifytext}</Tishi>
                        </p>
                        <p><button type="submit" className="shadow-input-style">{submitText}</button></p>
                    </form>
                </div>
            </div>
        )
    }
    componentDidMount() {
        setMarginTop(this.refs.box);
    }
}

export default connect((state, props) => {
    return {
        updatepass: state.loginMask.updatepass
    }
})(UpdatePass);