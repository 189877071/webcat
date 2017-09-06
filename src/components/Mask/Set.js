import React, { Component } from 'react'

import { connect } from 'react-redux'

import { appSetWinodw } from '../../store/app/action'

import Input from '../Common/Input'

import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

class Set extends Component {
    render() {
        const { dispatch, appSet } = this.props;

        const setMask = appSet.setEmail.step == 2 || !appSet.onoff ? 'block' : 'none';

        return (
            <div className="set" ref="box">
                <div className="close" title="关闭" onClick={this.close}>
                    <i className="iconfont icon-iconfontcha"></i>
                </div>

                <div className="header clearfix">

                    <div className="left set-photo" onClick={this.showUpdatePhoto}>
                        <img src={appSet.active.headphoto} alt="修改头像" />
                        <p>修改头像</p>
                    </div>

                    <div className="right set-name">
                        <p>
                            <span className="left">用户名：</span>
                            <input disabled value={appSet.active.username} className="right" type="text" />
                        </p>

                        <p>
                            <span className="left">昵&nbsp;&nbsp;&nbsp;称：</span>
                            <Input
                                className="right"
                                type="text"
                                value={appSet.active.name}
                                action={appSetWinodw.SETNAME}
                                placeholder="不能超出10位字符"
                            />
                        </p>
                    </div>

                </div>

                <div className="infor">
                    <p>
                        <span className="left">邮&nbsp;&nbsp;&nbsp;箱：</span>
                        <input className="right" type="email" value={appSet.active.email} disabled />
                        <a
                            href="javascript:;"
                            className="to-set"
                            dangerouslySetInnerHTML={{
                                __html: appSet.setEmail.show ? '<i class="iconfont icon-control-arr-copy"></i>取消' : '<i class="iconfont icon-xiugai1"></i>修改'
                            }}
                            onClick={this.showSetEmail}
                        />
                    </p>

                    <div className="set-email clearfix" style={{ display: appSet.setEmail.show ? 'block' : 'none' }}>
                        <p>
                            <span className="left">新邮箱：</span>
                            <Input
                                className="left verify"
                                type="email"
                                value={appSet.setEmail.newEmail}
                                action={appSetWinodw.SETNEWEMAIL}
                                placeholder="输入新邮箱地址"
                                onFocus={this.newEmailFocus}
                            />
                            <a href="javascript:;" className="verify-submit" onClick={this.verifyNewEmail}>{appSet.setEmail.submit}</a>
                            <em className="error r90">{appSet.setEmail.emailText}</em>
                        </p>
                        <p>
                            <span className="left">验证码：</span>
                            <Input
                                className="right"
                                type="text"
                                value={appSet.setEmail.verify}
                                placeholder="输入邮箱验证码"
                                action={appSetWinodw.SETNEWEMAILVERIFY}
                                onFocus={this.emailVerifFocus}
                            />
                            <em className="error">{appSet.setEmail.verifyText}</em>
                        </p>
                    </div>

                    <p>
                        <span className="left">密&nbsp;&nbsp;&nbsp;码：</span>
                        <input className="right" type="password" value="123456789" disabled />
                        <a
                            href="javascript:;"
                            className="to-set"
                            dangerouslySetInnerHTML={{
                                __html: appSet.setPass.show ? '<i class="iconfont icon-control-arr-copy"></i>取消' : '<i class="iconfont icon-xiugai1"></i>修改'
                            }}
                            onClick={this.showSetPass}
                        />
                    </p>

                    <div className="set-email clearfix" style={{ display: appSet.setPass.show ? 'block' : 'none' }}>
                        <p>
                            <span className="left">新密码：</span>
                            <Input
                                className="right"
                                type="password"
                                value={appSet.setPass.newPass}
                                placeholder="长度不能大于16位字符"
                                action={appSetWinodw.SETNEWPASS}
                                onFocus={this.newPassFocus}
                            />
                            <em className="error">{appSet.setPass.newPassText}</em>
                        </p>
                        <p>
                            <span className="left">确&nbsp;&nbsp;&nbsp;认：</span>
                            <Input
                                className="right"
                                type="password"
                                placeholder="确认密码"
                                value={appSet.setPass.rePass}
                                action={appSetWinodw.SETREPASS}
                                onFocus={this.rePassFocus}
                            />
                            <em className="error">{appSet.setPass.rePassText}</em>
                        </p>
                    </div>

                    <p>
                        <span className="left">年&nbsp;&nbsp;&nbsp;龄：</span>
                        <Input
                            className="right"
                            type="text"
                            value={appSet.active.age}
                            action={appSetWinodw.SETAGE}
                            placeholder="输入年龄"
                        />
                    </p>

                    <p>
                        <span className="left">性&nbsp;&nbsp;&nbsp;别：</span>
                        <select className="right" defaultValue={appSet.active.ext} onChange={this.setExt}>
                            <option value="1">男</option>
                            <option value="2">女</option>
                        </select>
                    </p>

                    <p className="set-synopsis">
                        <span className="left">简&nbsp;&nbsp;&nbsp;介：</span>
                        <textarea
                            className="right"
                            value={appSet.active.synopsis}
                            onChange={this.setJJ}
                        ></textarea>
                        <em className="textareazis">{appSet.active.synopsis.length}/150</em>
                    </p>

                    <p className="btn-box">
                        <button onClick={this.submit}>{appSet.btnText}</button>
                    </p>
                </div>
                <CSSTransitionGroup
                    transitionName="transitionGroup"
                    transitionLeaveTimeout={300}
                    transitionEnterTimeout={300}
                    className="set-tihis"
                    component='div'
                >
                    <div className="set-mask" key={setMask} style={{ display: setMask }}>
                        正在处理中……
                    </div>
                </CSSTransitionGroup>

            </div>
        )
    }

    close = () => this.props.dispatch(appSetWinodw.show());

    showSetEmail = () => this.props.dispatch(appSetWinodw.showSetEmail());

    showSetPass = () => this.props.dispatch(appSetWinodw.showSetPass());

    setExt = ev => this.props.dispatch({ type: appSetWinodw.SETEXT, value: ev.target.value })

    setJJ = ev => this.props.dispatch({ type: appSetWinodw.SETSYNOPSIS, value: ev.target.value })

    verifyNewEmail = () => this.props.dispatch(appSetWinodw.verifyNewEmail());

    newEmailFocus = () => this.props.dispatch({ type: appSetWinodw.SETEEMAILTEXT });

    emailVerifFocus = () => this.props.dispatch({ type: appSetWinodw.SETEMAILVERIFYTEXT });

    newPassFocus = () => this.props.dispatch({ type: appSetWinodw.SETNEWPASSTEXT });

    rePassFocus = () => this.props.dispatch({ type: appSetWinodw.SETREPASSTEXT });

    submit = () => this.props.dispatch(appSetWinodw.submit());

    showUpdatePhoto = () => this.props.dispatch({ type: appSetWinodw.UPDATEPHOTO, onoff: true });

    componentDidMount() {
        setMarginTop(this.refs.box);
    }
}

export default connect((state, props) => {
    return {
        appSet: state.appSet
    }
})(Set);