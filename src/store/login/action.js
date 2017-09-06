import { login, register, mask } from './state'

import { url, history } from '../../config'

import { appUserWindow } from '../app/action'

let regemailCountDown = null;

const repEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

export const LOGINONOFFACTION = 'LOGINONOFFACTION';

export const loginRegisterAction = {
    USERONCHANGE: 'REGISTERACTIONUSERONCHANGE',
    EMAILONCHANGE: 'REGISTERACTIONEMAILONCHANGE',
    PASSONCHANGE: 'REGISTERACTIONPASSONCHANGE',
    REPASSONCHANGE: 'REGISTERACTIONREPASSONCHANGE',
    VERIFYONCHANGE: 'REGISTERACTIONVERIFYONCHANGE',
    EMAILVONHANGE: 'REGISTERACTIONEMAILVONHANGE',
    INIT: 'REGISTERACTIONINIT',
    SHOWPASSBOX: 'REGISTERACTIONSHOWPASSBOX',
    SHOWIMGBOX: 'REGISTERACTIONSHOWIMGBOX',
    SHOWEMAILVBOX: 'REGISTERACTIONSHOWEMAILVBOX',
    USERALREADYREG: 'REGISTERACTIONUSERALREADYREG',
    EMAILALREADYREG: 'REGISTERACTIONEMAILALREADYREG',
    UNVERIFYPASS: 'REGISTERACTIONUNVERIFYPASS',
    UNVERIFYREPASS: 'REGISTERACTIONUNVERIFYREPASS',
    UNVERIFYVERIFY: 'REGISTERACTIONUNVERIFYVERIFY',
    UNVERIFYEMAILV: 'REGISTERACTIONUNUNVERIFYEMAILV',
    SETSTOP: 'REGISTERACTIONSETSTOP',
    SETTIME: 'REGISTERACTIONSETTIME',
    SETSUBMITTEXT: 'REGISTERACTIONSETSUBMITTEXT',
    SETJUMP: 'REGISTERACTIONSETJUMP',
    init() {
        return (dispatch) => {
            const initState = $.extend(true, {}, register);
            dispatch({ type: loginRegisterAction.INIT, state: initState });
        }
    },
    verifyuseroremail(o) {
        return (dispatch, getState) => {

            let action = '';

            let value = '';

            let param = {};

            if (o === 'user') {
                action = loginRegisterAction.USERALREADYREG;

                value = getState().loginRegister.user.value;

                if (!value)
                { return; }
                else if (value.length > 16) {
                    dispatch({ type: action, text: '长度不能超出16位', success: false });
                    return;
                }
                else if (value.length < 6) {
                    dispatch({ type: action, text: '长度不能小于6位', success: false });
                    return;
                }
                param = { username: value };
            }
            else if (o === 'email') {
                action = loginRegisterAction.EMAILALREADYREG;

                value = getState().loginRegister.email.value;

                if (!value)
                { return; }
                else if (!repEmail.test(value)) {
                    dispatch({ type: action, text: '邮箱格式不正确', success: false });
                    return;
                }
                param = { email: value };
            }
            else {
                return;
            }

            fetch(url.verifyUserURL, setFetchPost(param)).then(fetchResCallback).then((data) => {

                let [text, success] = ['', false];

                if (!data || !data.success) {
                    text = '用户名以存在';
                }
                else {
                    text = 'ok';
                    success = true;
                }

                dispatch({ type: action, text, success });
            })
        }
    },
    submit() {
        return (dispatch, getState) => {
            let state = $.extend(true, {}, getState().loginRegister);

            let onoff = true;

            const verifyfn = (obj, text) => {
                obj.text = text ? text : '不能为空';
                obj.success = false;
                onoff = false;
            }

            const verify = () => {

                if (state.user.value === '') {
                    verifyfn(state.user);
                }
                else if (state.user.value.length > 16) {
                    verifyfn(state.user, '长度不能超出16位');
                }
                else if (state.user.value.length < 6) {
                    verifyfn(state.user, '长度不能少于6位');
                }
                else if (!state.user.success) {
                    onoff = false;
                }

                if (state.email.value === '') {
                    verifyfn(state.email);
                }
                else if (!repEmail.test(state.email.value)) {
                    verifyfn(state.email, '邮箱格式不正确');
                }
                else if (!state.email.success) {
                    onoff = false;
                }

                if (state.pass.value === '') {
                    verifyfn(state.pass);
                }
                else if (state.pass.value > 20) {
                    verifyfn(state.pass, '长度不能超出20位');
                }
                else if (state.pass.value < 6) {
                    verifyfn(state.pass, '长度不能少于6位');
                }

                if (state.repass.value === '') {
                    verifyfn(state.repass);
                }
                else if (state.pass.value && state.pass.value != state.repass.value) {
                    verifyfn(state.repass, '两次密码输入不正确');
                }

                if (state.verify.value === '') {
                    verifyfn(state.verify);
                }

                return onoff;
            }

            const callbackVerify = (data) => {
                switch (data.text) {
                    case 1:
                        dispatch({ type: loginRegisterAction.UNVERIFYVERIFY, text: '验证码不正确', success: false });
                        return;
                    case 10:
                        dispatch({ type: loginRegisterAction.USERALREADYREG, text: '用户名以存在', success: false });
                        dispatch({ type: loginRegisterAction.EMAILALREADYREG, text: '邮箱以存在', success: false });
                        return;
                    case 11:
                        dispatch({ type: loginRegisterAction.USERALREADYREG, text: '用户名以存在', success: false });
                        return;
                    case 12:
                        dispatch({ type: loginRegisterAction.EMAILALREADYREG, text: '邮箱以存在', success: false });
                        return;
                    case 6:
                        alert('超时，请重新发送验证码');
                        return;
                    default:
                        alert('系统出错！请稍后尝试');
                }
            }

            const regok = () => {
                dispatch({ type: loginRegisterAction.SETSTOP, stop: 4 });
                countDownTime(state.jump, t => {
                    dispatch({ type: loginRegisterAction.SETJUMP, t });
                    if (t <= 0) history.push('/');
                });
            }

            const stop1 = () => {
                const param = {
                    stop: 1,
                    username: state.user.value,
                    email: state.email.value,
                    password: state.pass.value,
                    verify: state.verify.value
                }

                dispatch({ type: loginRegisterAction.SETSTOP, stop: 3 });

                fetch(url.registerURL, setFetchPost(param)).then(fetchResCallback).then((data) => {
                    dispatch({ type: loginRegisterAction.SETSTOP, stop: 2 });

                    if (data && !data.success) {
                        callbackVerify(data);
                    }
                    else if (data.success) {
                        dispatch({ type: loginRegisterAction.SETSUBMITTEXT, text: '注 册' });
                        dispatch({ type: loginRegisterAction.SHOWEMAILVBOX, h: 42 });
                        countDownTime(state.time, t => dispatch({ type: loginRegisterAction.SETTIME, t }));
                    }
                });
            }
            
            const stop2 = () => {
                if (state.emailv.value == '') {
                    verifyfn(state.emailv);
                    return;
                }
                const param = {
                    stop: 2,
                    emailVerify: state.emailv.value
                }

                dispatch({ type: loginRegisterAction.SETSTOP, stop: 3 });

                fetch(url.registerURL, setFetchPost(param)).then(fetchResCallback).then((data) => {
                    dispatch({ type: loginRegisterAction.SETSTOP, stop: 2 });
                    if (data && data.success) {
                        // history.push('/');
                        // 注册成功
                        regok();
                    }
                    else if (data && data.text == 8) {
                        dispatch({ type: loginRegisterAction.UNVERIFYEMAILV, text: '验证码不正确', success: false });
                    }
                    else {
                        alert('注册失败');
                    }
                });
            }

            if (state.stop === 1) {
                if (!verify()) {
                    dispatch({ type: loginRegisterAction.INIT, state: state });
                }
                else {
                    stop1();
                }
            }
            else if (state.stop === 2) {
                stop2();
            }

        }
    },
    reemail() {
        return (dispatch, getState) => {

            let state = getState().loginRegister;

            if (state.time > 0) return;

            dispatch({ type: loginRegisterAction.SETSTOP, stop: 3 });

            fetch(url.registerURL, setFetchPost({ stop: 3 })).then(fetchResCallback).then((data) => {

                if (data && data.success) {
                    dispatch({ type: loginRegisterAction.SETSTOP, stop: 2 });
                    countDownTime(register.time, t => dispatch({ type: loginRegisterAction.SETTIME, t }));
                }
                else {
                    alert('邮箱发送失败');
                }
            });
        }
    }
}

export const loginMaskAction = {
    ANDROID: 'LOGINMOBLIEACTIONSHOWANDROID',
    WEB: 'LOGINMOBLIEACTIONSHOWWEB',
    IOS: 'LOGINMOBLIEACTIONSHOWIOS',
    UPDATEPASS: 'LOGINMOBLIEACTIONUPDATEPASS',
    INIT: 'LOGINMOBLIEACTIONINIT',
    UPDATEPASSEMAILONCHANGE: 'LOGINMOBLIEACTIONUPDATEPASSEMAILONCHANGE',
    UPDATEPASSPASSONCHANGE: 'LOGINMOBLIEACTIONUPDATEPASSPASSONCHANGE',
    UPDATEPASSREPASSONCHANGE: 'LOGINMOBLIEACTIONUPDATEPASSREPASSONCHANGE',
    UPDATEPASSVERIFYONCHANGE: 'LOGINMOBLIEACTIONUPDATEPASSVERIFYONCHANGE',
    UPDATEPASSEMAILTEXT: 'LOGINMOBLIEACTIONUPDATEPASSEMAILTEXT',
    UPDATEPASSSTEP: 'LOGINMOBLIEACTIONUPDATEPASSSTEP',
    UPDATEPASSEMAILSUBMIT: 'LOGINMOBLIEACTIONUPDATEPASSEMAILSUBMIT',
    UPDATEPASSPASSTEXT: 'LOGINMOBLIEACTIONUPDATEPASSPASSTEXT',
    UPDATEPASSREPASSTEXT: 'LOGINMOBLIEACTIONUPDATEPASSREPASSTEXT',
    UPDATEPASSVERIFYTEXT: 'LOGINMOBLIEACTIONUPDATEPASSVERIFYTEXT',
    UPDATEPASSSUBMIT: 'LOGINMOBLIEACTIONUPDATEPASSSUBMIT',
    GETUSERS: 'LOGINMOBLIEACTIONGETUSERS',
    init() {
        return (dispatch) => {
            const initState = $.extend(true, {}, mask);
            dispatch({ type: loginMaskAction.INIT, state: initState });
        }
    },
    sendEmailVerify() {
        return (dispatch, getState) => {
            const state = $.extend(true, {}, getState());
            let otime = null;
            const [step, email, countDown] = [
                state.loginMask.updatepass.step,
                state.loginMask.updatepass.email.value,
                () => {
                    let t = 120;
                    dispatch({ type: loginMaskAction.UPDATEPASSEMAILSUBMIT, text: `倒计时 ${t > 9 ? t : '0' + t} 秒` });
                    clearInterval(otime);
                    otime = setInterval(() => {
                        t--;
                        if (t <= 0) {
                            t = 0;
                            clearInterval(otime);
                            dispatch({ type: loginMaskAction.UPDATEPASSSTEP, step: 1 });
                            dispatch({ type: loginMaskAction.UPDATEPASSEMAILSUBMIT, text: '验证码过期,重新发送验证码' });
                        }
                        else {
                            dispatch({ type: loginMaskAction.UPDATEPASSEMAILSUBMIT, text: `倒计时 ${t > 9 ? t : '0' + t} 秒` });
                        }
                    }, 1000);
                }
            ];

            if (step != 1) return;

            if (email == '') {
                dispatch({ type: loginMaskAction.UPDATEPASSEMAILTEXT, text: '邮箱地址不能为空', success: false });
                return;
            }

            if (!repEmail.test(email)) {
                dispatch({ type: loginMaskAction.UPDATEPASSEMAILTEXT, text: '邮箱地址格式不正确', success: false });
                return;
            }

            dispatch({ type: loginMaskAction.UPDATEPASSSTEP, step: 0 });
            dispatch({ type: loginMaskAction.UPDATEPASSEMAILSUBMIT, text: '正在发送验证码……' });

            fetch(url.updatepassURL, setFetchPost({ step: 1, email })).then(fetchResCallback).then(data => {
                if (data && data.success) {
                    dispatch({ type: loginMaskAction.UPDATEPASSSTEP, step: 2 });
                    countDown();
                    return;
                }

                dispatch({ type: loginMaskAction.UPDATEPASSSTEP, step: 1 });
                clearInterval(otime);
                dispatch({ type: loginMaskAction.UPDATEPASSEMAILSUBMIT, text: '获取验证码' });

                if (data && data.text == 2) {
                    dispatch({ type: loginMaskAction.UPDATEPASSEMAILTEXT, text: '邮箱地址不存在', success: false });
                }
                else {
                    alert('验证码发送失败, 请稍后尝试');
                }
            })
        }
    },
    updateSubmit() {
        return (dispatch, getState) => {
            const state = $.extend(true, {}, getState());

            const [step, pass, repass, verify] = [
                state.loginMask.updatepass.step,
                state.loginMask.updatepass.pass.value,
                state.loginMask.updatepass.repass.value,
                state.loginMask.updatepass.verify.value
            ];

            if (step != 2) return;

            if (pass == '') {
                dispatch({ type: loginMaskAction.UPDATEPASSPASSTEXT, text: '新密码不能为空', success: false });
                return;
            }

            if (pass.length < 6) {
                dispatch({ type: loginMaskAction.UPDATEPASSPASSTEXT, text: '密码长度不能少于6位字符', success: false });
                return;
            }

            if (pass.length > 20) {
                dispatch({ type: loginMaskAction.UPDATEPASSPASSTEXT, text: '密码长度不能大于20位字符', success: false });
                return;
            }

            if (repass == '') {
                dispatch({ type: loginMaskAction.UPDATEPASSREPASSTEXT, text: '请先确认密码', success: false });
                return;
            }

            if (repass != pass) {
                dispatch({ type: loginMaskAction.UPDATEPASSREPASSTEXT, text: '两次密码不正确', success: false });
                return;
            }

            if (verify == '') {
                dispatch({ type: loginMaskAction.UPDATEPASSVERIFYTEXT, text: '验证码不能为空', success: false });
                return;
            }

            dispatch({ type: loginMaskAction.UPDATEPASSSTEP, step: 0 });
            dispatch({ type: loginMaskAction.UPDATEPASSSUBMIT, text: '正在提交……' });

            fetch(url.updatepassURL, setFetchPost({ step: 2, password: pass, verify })).then(fetchResCallback).then(data => {
                if (data && data.success) {
                    dispatch({ type: loginMaskAction.UPDATEPASSSUBMIT, text: '修改成功' });
                    alert('密码修改成功');
                    dispatch(loginMaskAction.init());
                    return;
                }

                dispatch({ type: loginMaskAction.UPDATEPASSSTEP, step: 2 });
                dispatch({ type: loginMaskAction.UPDATEPASSSUBMIT, text: '确 认' });
                console.log(data);
                if (data && data.text == 2) {
                    dispatch({ type: loginMaskAction.UPDATEPASSVERIFYTEXT, text: '验证码不正确', success: false });
                }
                else {
                    alert('验证码发送失败, 请稍后尝试');
                }
            });
        }
    }

}

export const loginIndexAction = {
    USERONCHANGE: 'LOGINACTIONUSERONCHANGE',
    PASSONCHANGE: 'LOGINACTIONPASSONCHANGE',
    VERIFYONCHANGE: 'LOGINACTIONVERIFYONCHANGE',
    SHOWIMGVERIFY: 'LOGINACTIONSHOWIMGVERIFY',
    DELAYEDONCHANGE: 'LOGINACTIONDELAYEDONCHANGE',
    INIT: 'LOGINACTIONINIT',
    STTVERIFYUSER: 'LOGINACTIONSTTVERIFYUSER',
    SETVERIFYPASS: 'LOGINACTIONSETVERIFYEMAIL',
    SETVERIFYIMG: 'LOGINACTIONSETVERIFYIMG',
    SETDELAYEDKEY: 'LOGINACTIONSETDELAYEDKEY',
    SETSTOP: 'LOGINACTIONSETSTOP',
    init() {
        return (dispatch) => {
            const initState = $.extend(true, {}, login);
            dispatch({ type: loginIndexAction.INIT, state: initState });
        }
    },
    delayed(checked) {
        return dispatch => {
            dispatch({ type: loginIndexAction.DELAYEDONCHANGE, onoff: checked });


            if (!window.localStorage) return;

            let key = '';

            if (checked) {
                key = setAutoLoginKey();
                localStorage.setItem('autoLogin', key);
            }
            else {
                localStorage.removeItem('autoLogin');
            }

            dispatch({ type: loginIndexAction.SETDELAYEDKEY, key });
        }
    },
    submit() {
        return (dispatch, getState) => {
            const state = getState().loginIndex;

            if (state.stop != 1) return;

            let onoff = true;

            if (state.user.value == '') {
                onoff = false;
                dispatch({ type: loginIndexAction.STTVERIFYUSER, text: '不能为空', success: false });
            }

            if (state.pass.value == '') {
                onoff = false;
                dispatch({ type: loginIndexAction.SETVERIFYPASS, text: '不能为空', success: false });
            }

            if (state.verify.value == '') {
                onoff = false;
                dispatch({ type: loginIndexAction.SETVERIFYIMG, text: '不能为空', success: false });
            }

            if (!onoff || !socketInit) return;

            // 把这个数据提交到 登录api 先睡觉
            // 登录 重新考量一下 实现过程 明天写
            // socket 连接需不需要加key 不需要
            // 登录的时候 要socket 发送来的参数带上 一并处理 才算完成登录

            const param = {
                ...socketInit,
                username: state.user.value,
                password: state.pass.value,
                verify: state.verify.value,
                delayed: state.key
            }


            dispatch({ type: loginIndexAction.SETSTOP, stop: 2 });

            fetch(url.loginURL, setFetchPost(param)).then(fetchResCallback).then((data) => {
                dispatch({ type: loginIndexAction.SETSTOP, stop: 1 });
                if (!data) {
                    alert('系统出现异常，暂时无法登录，请稍后尝试');
                }
                else if (!data.success) {
                    switch (data.text) {
                        case 5:
                            dispatch({ type: loginIndexAction.SETVERIFYIMG, text: '验证码不正确', success: false });
                            return;
                        case 6:
                            dispatch({ type: loginIndexAction.STTVERIFYUSER, text: repEmail.test(state.user.value) ? '邮箱地址不存在' : '用户名不存在', success: false });
                            return;
                        case 7:
                            dispatch({ type: loginIndexAction.SETVERIFYPASS, text: '密码不正确', success: false });
                            return;
                        default:
                            alert('系统出现异常，暂时无法登录，请稍后尝试');
                            return;
                    }
                }
                else {
                    dispatch({ type: LOGINONOFFACTION, onoff: true });
                    dispatch({ type: appUserWindow.INITDATA, data: data.userData });
                    history.push('/app');
                }
            });
        }
    }
}



