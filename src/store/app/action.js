import { url, history } from '../../config'

import { LOGINONOFFACTION, loginIndexAction } from '../login/action'

import { login } from '../login/state'

let alluserdataOne = false;

const repEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

export const getCatLog = (miId, heId) => {
    return new Promise(reslove => {
        fetch(url.catlogURL, setFetchPost({ id: heId })).then(fetchResCallback).then(data => {
            if (!data || !data.success) {
                reslove([]);
                return;
            }
            let arr = [];
            data.data.forEach(item => arr.push({ content: item.content, send: item.sendid == miId ? 0 : 1, time: item.otime }));
            reslove(arr);
        });
    })
}

export const APPZINDEXACTION = 'APPZINDEXACTION';

export const appUserWindow = {
    INITDATA: 'APPUSERWINDOWINITDATA',
    ALLUSERDATA: 'APPUSERWINDOWALLUSERDATA',
    ONLINEUSERTISHIE: 'APPUSERWINDOWONLINEUSERTISHIE',
    SETZINDEX: 'APPUSERWINDOWSETZINDEX',
    AUDIO: 'APPUSERWINDOWAUDIO',
    alluserdata() {
        return (dispatch, getState) => {

            if (alluserdataOne) return;

            alluserdataOne = true;

            fetch(url.allDataURL, setFetchPost()).then(fetchResCallback).then(data => {

                const leaveInfor = data.leaveInfor;

                let arr = [];

                let leaveInforList = {};

                for (let i = 0; i < leaveInfor.length; i++) {
                    if (arr.indexOf(leaveInfor[i].sendid) != -1) {
                        leaveInforList[leaveInfor[i].sendid]++;
                    }
                    else {
                        arr.push(leaveInfor[i].sendid);
                        leaveInforList[leaveInfor[i].sendid] = 1;
                    }
                }

                for (let i = 0; i < data.users.length; i++) {

                    data.users[i].login = 0;

                    for (let j = 0; j < data.login.length; j++) {
                        if (data.users[i].id == data.login[j].userid) {
                            data.users[i].login = 1;
                            data.users.unshift(data.users.splice(i, 1)[0]);
                        }
                    }

                    leaveInforList[data.users[i].id] && (data.users[i].leaveInfor = leaveInforList[data.users[i].id]);
                }

                dispatch({ type: appUserWindow.ALLUSERDATA, users: data.users });
            });
        }
    },
    showCat(index) {
        return (dispatch, getState) => {

            dispatch({ type: APPZINDEXACTION });

            const state = $.extend(true, {}, getState());

            let [users, list, boxlist, miId] = [
                state.appActive.users,
                state.appCat.list,
                state.appCat.boxList,
                state.appActive.active.id
            ];

            if (!users[index]) return;

            for (let i = 0; i < boxlist.length; i++) {
                if (boxlist[i].id == users[index].id) {
                    dispatch({ type: appCatWindow.BOXACTIVE, num: i });
                    dispatch({ type: appCatWindow.BOXZINDEX, num: state.appZindex });
                    return;
                }
            }

            for (let i = 0; i < list.length; i++) {
                if (users[index].id == list[i].id && list[i].offset) {
                    list[i].offset.zindex = state.appZindex;
                    dispatch({ type: appCatWindow.RELIST, list });
                    return;
                }
            }

            users[index].record = [];  // 聊天记录
            users[index].editorvalue = ''; // 编辑器内容
            users[index].biaoqingshow = false; // 是否显示表情包
            users[index].leaveInfor = 0;

            boxlist.push(users[index]);

            const active = boxlist.length - 1;

            dispatch({ type: appCatWindow.BOXACTIVE, num: active });
            dispatch({ type: appCatWindow.BOXZINDEX, num: state.appZindex });
            dispatch({ type: appCatWindow.REBOXLIST, list: boxlist });



            getCatLog(miId, users[index].id).then(data => {
                let boxList = $.extend(true, {}, getState()).appCat.boxList;
                boxList[active].record = data;
                dispatch({ type: appCatWindow.REBOXLIST, list: boxList });

                dispatch({ type: appUserWindow.ALLUSERDATA, users: users });
            });
        }
    },
    setzindex() {
        return (dispatch, getState) => {
            dispatch({ type: APPZINDEXACTION });

            dispatch({ type: appUserWindow.SETZINDEX, num: getState().appZindex });
        }
    },
    exit() {
        return dispatch => {
            fetch(url.exitURL, setFetchPost({ operation: 2, ...socketInit })).then(fetchResCallback).then(data => {
                if (data && data.success) {
                    dispatch({ type: LOGINONOFFACTION, onoff: false });
                    dispatch({ type: loginIndexAction.INIT, state: $.extend(true, {}, login) });
                    localStorage.removeItem('autoLogin');
                    window.onbeforeunload = null;
                    // history.push('/login');
                    location.href = '/';
                }
                else {
                    alert('退出失败');
                }
            })
        }
    },
}



export const appCatWindow = {
    RELIST: 'APPCATWINDOWREUSERS',
    REBOXLIST: 'APPCATWINDOWREBOXLIST',
    SETZINDEZ: 'APPCATWINDOWSETZINDEZ',
    BOXACTIVE: 'APPCATWINDOWSETALLACTIVE',
    BOXZINDEX: 'APPCATWINDOWALLZINDEX',
    FILTER: 'APPCATWINDOWFILTER',
    VIDEOCALL: 'APPCATWINDOWVIDEOCALL',
    SENDFILE: 'APPCATWINDOWSENDFILE',
    SHOWIMG: 'APPCATWINDOWSHOWIMG',
    AUDIOCALL: 'APPCATWINDOWAUDIOCALL',
    close(index) {
        return (dispatch, getState) => {
            const state = $.extend(true, {}, getState());

            let [list] = [
                state.appCat.list
            ];

            if (!list[index]) return;

            list.splice(index, 1);

            dispatch({ type: appCatWindow.RELIST, list });
        }
    },
    boxclose(index) {
        return (dispatch, getState) => {

            const state = $.extend(true, {}, getState());

            const [list, num] = [
                state.appCat.boxList,
                state.appCat.boxActive - 1 > 0 ? state.appCat.boxActive - 1 : 0
            ];

            if (!list[index]) return;

            list.splice(index, 1);
            dispatch({ type: appCatWindow.BOXACTIVE, num });
            dispatch({ type: appCatWindow.REBOXLIST, list });
        }
    },
    setallzindex() {
        return (dispatch, getState) => {
            dispatch({ type: APPZINDEXACTION });
            dispatch({ type: appCatWindow.BOXZINDEX, num: getState().appZindex });
        }
    },
    boxlistdrag(index, offset) {
        return (dispatch, getState) => {
            dispatch({ type: APPZINDEXACTION });

            const state = $.extend(true, {}, getState());

            let [list, boxList, boxActive] = [
                state.appCat.list,
                state.appCat.boxList,
                state.appCat.boxActive
            ];

            if (!boxList[index]) return;

            let [oUserCat, num] = [
                boxList.splice(index, 1)[0],
                boxActive - 1 > 0 ? boxActive - 1 : 0
            ];

            oUserCat.offset = {
                ...offset,
                zIndex: state.appZindex
            }

            list.push(oUserCat);

            dispatch({ type: appCatWindow.BOXACTIVE, num });
            dispatch({ type: appCatWindow.RELIST, list });
            dispatch({ type: appCatWindow.REBOXLIST, list: boxList });
        }
    },
    reoffset(index, offset) {
        return (dispatch, getState) => {
            const state = $.extend(true, {}, getState());

            let [list] = [state.appCat.list];

            if (!list[index]) return;

            list[index].offset.left = offset.left;
            list[index].offset.top = offset.top;

            dispatch({ type: appCatWindow.RELIST, list });
        }
    },
    setzindex(index) {
        return (dispatch, getState) => {
            dispatch({ type: APPZINDEXACTION });

            const state = $.extend(true, {}, getState());

            let [list, zindex] = [
                state.appCat.list,
                getState().appZindex
            ];

            if (!list[index]) return;

            list[index].offset.zIndex = zindex;

            dispatch({ type: appCatWindow.RELIST, list });
        }
    },
    editorchange(value, index) {
        return (dispatch, getState) => {

            const [state, init] = [
                $.extend(true, {}, getState()),
                (typeof index == 'number')
            ];

            const [list, active, type] = [
                init ? state.appCat.list : state.appCat.boxList,
                init ? index : state.appCat.boxActive,
                init ? appCatWindow.RELIST : appCatWindow.REBOXLIST
            ];

            if (!list[active]) return;

            list[active].editorvalue = value;

            dispatch({ type, list });

        }
    },
    showbiaoqingbao(index) {
        return (dispatch, getState) => {
            const [state, init] = [
                $.extend(true, {}, getState()),
                (typeof index == 'number')
            ];

            const [list, active, type] = [
                init ? state.appCat.list : state.appCat.boxList,
                init ? index : state.appCat.boxActive,
                init ? appCatWindow.RELIST : appCatWindow.REBOXLIST
            ];

            if (!list[active]) return;

            list[active].biaoqingshow = !list[active].biaoqingshow;

            dispatch({ type, list });
        }
    },
    send(callback, index) {
        return (dispatch, getState) => {
            const [state, init] = [
                $.extend(true, {}, getState()),
                (typeof index == 'number')
            ];

            const [list, active, type, req, reqn] = [
                init ? state.appCat.list : state.appCat.boxList,
                init ? index : state.appCat.boxActive,
                init ? appCatWindow.RELIST : appCatWindow.REBOXLIST,
                /<img[\s|\d|\w|"|'|=|\/|\.|-]*>/gi,
                /data-index="(\d{1,})"/i
            ];

            if (!list[active] || list[active].editorvalue == '') return;

            let content = list[active].editorvalue;

            const imgArr = content.match(req);

            if (imgArr) {
                imgArr.forEach((item, index) => {
                    content = content.replace(item, `{{表情${item.match(reqn)[1]}}}`);
                })
            }

            content = content.replace(/<br>/gi, '')
                .replace(/<\/div>|<div>/g, '%%nbsp;')
                .replace(/\\/g, '')
                .replace(/</g, '')
                .replace(/>/g, '')
                .replace(/&lt;/g, '')
                .replace(/&gt;/g, '')
                .replace(/&/g, '')
                .replace(/\r|\n|\s/gi, '');

            if (content.length == '') {
                alert('聊天信息不可以都是反斜杠哦');
                callback && callback();
                return;
            }

            if (content.length > 500) {
                alert('聊天信息不能大于500个字符呢');
                return;
            }

            const param = { content, receiveid: list[active].id, operation: 'common' };

            fetch(url.sendURL, setFetchPost(param)).then(fetchResCallback).then(data => {

                if (!data.success) {
                    alert('发送失败');
                    console.log(data);
                    return;
                }

                list[active].record.push({ content, send: 0, time: Date.now() });

                dispatch({ type, list });

                callback && callback();
            });
        }
    },
    videoCallShow(id, opaction = 1) {
        return (dispatch, getState) => {

            if (!Number(id)) return;

            window.videoCallData.id = id;

            dispatch({ type: APPZINDEXACTION });

            const [state, hujiao, hujiaoshengyin] = [
                $.extend(true, {}, getState()),
                $('#hujiao').get(0),
                () => {
                    if (getState().appActive.audio) hujiao.play();
                }
            ];

            if (state.appCat.videoCall.show) {
                alert('当前正在视频通话，请关闭视频通话窗口后尝试！');
                return;
            }

            if (state.appCat.audioCall.show) {
                alert('当前正在语音通话，请关闭语音通话窗口后尝试！');
                return;
            }

            let [user, active, users] = [
                null,
                state.appActive.active,
                state.appActive.users
            ];

            for (let i = 0; i < users.length; i++) {
                if (users[i].id === id) {
                    user = users[i];
                    break;
                }
            }

            if (!user || user.login != 1) {
                alert('对方没在线上，无法进行通讯');
                return;
            }

            dispatch({
                type: appCatWindow.VIDEOCALL,
                data: {
                    show: true,
                    zIndex: state.appZindex,
                    opaction,
                    id,
                    headphoto: user.headphoto,
                    hename: user.name ? user.name : user.username,
                    myname: active.name ? active.name : active.username
                }
            });

            hujiaoshengyin();
            clearInterval(videoCallData.time);
            videoCallData.time = setInterval(hujiaoshengyin, Math.ceil(hujiao.duration) * 1000);
        }
    },
    videoCallBoxDown() {
        return (dispatch, getState) => {
            dispatch({ type: APPZINDEXACTION });

            const state = $.extend(true, {}, getState());

            state.appCat.videoCall.zIndex = state.appZindex;

            dispatch({ type: appCatWindow.VIDEOCALL, data: state.appCat.videoCall });
        }
    },
    videojujue(n) {
        // 拒绝
        return (dispatch, getState) => {

            if (!Number(window.videoCallData.id)) {
                return;
            }

            let text = 2;

            if (n && getState().appCat.videoCall.opaction == 1) {
                text = 3;
            }

            fetch(url.sendURL, setFetchPost({
                content: JSON.stringify({ success: false, text }),
                receiveid: window.videoCallData.id,
                operation: 'videoCommunicationCallback'
            }));

            dispatch({ type: appCatWindow.VIDEOCALL, data: {} });
            clearInterval(videoCallData.time);
        }
    },
    videotongyi() {
        // 同意
        return (dispatch, getState) => {
            clearInterval(videoCallData.time);
            const [videoCall] = [$.extend(true, {}, getState()).appCat.videoCall];
            videoCall.opaction = 1;
            dispatch({ type: appCatWindow.VIDEOCALL, data: videoCall });
        }
    },
    sendimg(src, id) {
        return (dispatch, getState) => {
            if (!src || !Number(id)) return;

            let oFormData = new FormData();
            oFormData.append('content', src);
            oFormData.append('receiveid', id);
            oFormData.append('operation', 'image');

            let xhr = new XMLHttpRequest();

            xhr.open('POST', url.sendURL, true);
            xhr.responseType = 'json';
            xhr.setRequestHeader('X-Request-With', 'XMLHttpRequest');

            xhr.onload = e => {

                if (!xhr.response.success) {
                    alert('发送失败');
                    return;
                }

                dispatch({ type: appCatWindow.SENDFILE, data: { show: false } });

                const state = $.extend(true, {}, getState());

                for (let i = 0; i < state.appCat.boxList.length; i++) {
                    if (state.appCat.boxList[i].id == id) {
                        state.appCat.boxList[i].record.push({ content: xhr.response.content, send: 0, time: Date.now() });
                        dispatch({ type: appCatWindow.REBOXLIST, list: state.appCat.boxList });
                        return;
                    }
                }

                for (let i = 0; i < state.appCat.list.length; i++) {
                    if (state.appCat.list[i].id == id) {
                        state.appCat.list[i].record.push({ content: xhr.response.content, send: 0, time: Date.now() });
                        dispatch({ type: appCatWindow.RELIST, list: state.appCat.list });
                        return;
                    }
                }

                xhr = null;
                oFormData = null;
            }

            xhr.send(oFormData);
        }
    },
    audioCallShow(id, opaction = 1) {
        return (dispatch, getState) => {

            if (!Number(id)) return;

            window.audioCallData.id = id;

            dispatch({ type: APPZINDEXACTION });

            const [state, hujiao, hujiaoshengyin] = [
                $.extend(true, {}, getState()),
                $('#hujiao').get(0),
                () => {
                    if (getState().appActive.audio) hujiao.play();
                }
            ];

            if (state.appCat.videoCall.show) {
                alert('当前正在视频通话，请关闭视频通话窗口后尝试！');
                return;
            }

            if (state.appCat.audioCall.show) {
                alert('当前正在语音通话，请关闭语音通话窗口后尝试！');
                return;
            }

            let [user, active, users] = [
                null,
                state.appActive.active,
                state.appActive.users
            ];

            for (let i = 0; i < users.length; i++) {
                if (users[i].id === id) {
                    user = users[i];
                    break;
                }
            }

            if (!user || user.login != 1) {
                alert('对方没在线上，无法进行通讯');
                return;
            }

            dispatch({
                type: appCatWindow.AUDIOCALL,
                data: {
                    show: true,
                    zIndex: state.appZindex,
                    opaction,
                    id,
                    headphoto: user.headphoto,
                    hename: user.name ? user.name : user.username,
                    myname: active.name ? active.name : active.username
                }
            });

            hujiaoshengyin();
            clearInterval(audioCallData.time);
            audioCallData.time = setInterval(hujiaoshengyin, Math.ceil(hujiao.duration) * 1000);
        }
    },
    audioCallBoxDown() {
        return (dispatch, getState) => {
            dispatch({ type: APPZINDEXACTION });

            const state = $.extend(true, {}, getState());

            state.appCat.audioCall.zIndex = state.appZindex;

            dispatch({ type: appCatWindow.AUDIOCALL, data: state.appCat.audioCall });
        }
    },
    audiojujue(n) {
        // 拒绝
        return (dispatch, getState) => {

            if (!Number(window.audioCallData.id)) {
                return;
            }

            let text = 2;

            if (n && getState().appCat.audioCall.opaction == 1) {
                text = 3;
            }

            fetch(url.sendURL, setFetchPost({
                content: JSON.stringify({ success: false, text }),
                receiveid: window.audioCallData.id,
                operation: 'audioCommunicationCallback'
            }));

            dispatch({ type: appCatWindow.AUDIOCALL, data: {} });

            clearInterval(window.audioCallData.time);
        }
    },
    audiotongyi() {
        return (dispatch, getState) => {
            clearInterval(audioCallData.time);
            const [audioCall] = [$.extend(true, {}, getState()).appCat.audioCall];
            audioCall.opaction = 1;
            dispatch({ type: appCatWindow.AUDIOCALL, data: audioCall });
        }
    }
}

export const appSetWinodw = {
    SET: 'APPSETWINDOWSET',
    SETNAME: 'APPSETWINDOWSETNAME',
    SETNEWEMAIL: 'APPSETWINDOWSETNEWEMAIL',
    SETNEWEMAILVERIFY: 'APPSETWINDOWSETNEWEMAILVERIFY',
    SETNEWPASS: 'APPSETWINDOWSETNEWPASS',
    SETREPASS: 'APPSETWINDOWSETREPASS',
    SETAGE: 'APPSETWINDOWSETAGE',
    SETEXT: 'APPSETWINDOWSETEXT',
    SETSYNOPSIS: 'APPSETWINDOWSETSYNOPSIS',
    SETEEMAILTEXT: 'APPSETWINDOWSETEEMAILTEXT',
    SETEMAILVERIFYTEXT: 'APPSETWINDOWSETEMAILVERIFYTEXT',
    SETNEWPASSTEXT: 'APPSETWINDOWSETNEWPASSTEXT',
    SETREPASSTEXT: 'APPSETWINDOWSETREPASSTEXT',
    BTNTEXT: 'APPSETWINDOWBTNTEXT',
    UPDATEPHOTO: 'APPSETWINDOWUPDATEPHOTO',
    SETIMGSRC: 'APPSETWINDOWSETIMGSRC',
    SETIMGACTIVE: 'APPSETWINDOWSETIMGACTIVE',
    SETHEADPHOTO: 'APPSETWINDOWSETHEADPHOTO',
    show() {
        return (dispatch, getState) => {
            const state = $.extend(true, {}, getState());

            const { appSet, appActive } = state;

            appSet.show = !appSet.show;

            appSet.active = appActive.active;

            appSet.setEmail = {
                show: false,
                newEmail: '',
                emailText: '',
                verify: '',
                verifyText: '',
                submit: '获取验证码',
                step: 1,
            };

            appSet.setPass = {
                show: false,
                newPass: '',
                newPassText: '',
                rePass: '',
                rePassText: ''
            };

            dispatch({ type: appSetWinodw.SET, data: appSet });
        }
    },
    showSetEmail() {
        return (dispatch, getState) => {
            const appSet = $.extend(true, {}, getState().appSet);
            appSet.setEmail.show = !!!appSet.setEmail.show;
            dispatch({ type: appSetWinodw.SET, data: appSet });
        }
    },
    showSetPass() {
        return (dispatch, getState) => {
            const appSet = $.extend(true, {}, getState().appSet);
            appSet.setPass.show = !!!appSet.setPass.show;
            dispatch({ type: appSetWinodw.SET, data: appSet });
        }
    },
    verifyNewEmail() {
        return (dispatch, getState) => {
            const appSet = $.extend(true, {}, getState().appSet);

            if (appSet.setEmail.step != 1) {
                return;
            }

            const email = appSet.setEmail.newEmail;


            if (!email) {
                appSet.setEmail.emailText = '邮箱不能为空';
                dispatch({ type: appSetWinodw.SET, data: appSet });
                return;
            }

            if (!repEmail.test(email)) {
                appSet.setEmail.emailText = '邮箱格式不正确';
                dispatch({ type: appSetWinodw.SET, data: appSet });
                return;
            }

            appSet.setEmail.submit = '……';
            appSet.setEmail.step = 2;
            dispatch({ type: appSetWinodw.SET, data: appSet });

            fetch(url.emailVerifyURL, setFetchPost({ email })).then(fetchResCallback).then(data => {

                const appSet = $.extend(true, {}, getState().appSet);

                if (data && !data.success && data.text == 3) {
                    appSet.setEmail.emailText = '该邮箱以存在';
                    appSet.setEmail.step = 1;
                    appSet.setEmail.submit = '获取验证码';
                    dispatch({ type: appSetWinodw.SET, data: appSet });
                    return;
                }
                else if (!data || !data.success) {
                    alert('邮件发送失败,请稍后尝试');
                    appSet.setEmail.step = 1;
                    appSet.setEmail.submit = '获取验证码';
                    dispatch({ type: appSetWinodw.SET, data: appSet });
                    return;
                }

                appSet.setEmail.submit = '发送成功';
                appSet.setEmail.step = 1;
                dispatch({ type: appSetWinodw.SET, data: appSet });
            })
        }
    },
    submit() {
        return (dispatch, getState) => {
            const appSet = $.extend(true, {}, getState().appSet);

            if (!appSet.onoff) {
                return;
            }

            const { age, name, synopsis, ext } = appSet.active;

            let [newEmail, newPass, verifyEmail] = [false, false, false];

            if (appSet.setEmail.show) {
                if (!appSet.setEmail.newEmail) {
                    appSet.setEmail.emailText = '邮箱不能为空';
                    dispatch({ type: appSetWinodw.SET, data: appSet });
                    return;
                }

                if (!repEmail.test(appSet.setEmail.newEmail)) {
                    appSet.setEmail.emailText = '邮箱格式不正确';
                    dispatch({ type: appSetWinodw.SET, data: appSet });
                    return;
                }

                if (!appSet.setEmail.verify) {
                    appSet.setEmail.verifyText = '验证码不能为空';
                    dispatch({ type: appSetWinodw.SET, data: appSet });
                    return;
                }

                newEmail = appSet.setEmail.newEmail;
                verifyEmail = appSet.setEmail.verify;
            }

            if (appSet.setPass.show) {
                if (!appSet.setPass.newPass) {
                    appSet.setPass.newPassText = '密码不能为空';
                    dispatch({ type: appSetWinodw.SET, data: appSet });
                    return;
                }

                if (appSet.setPass.newPass.length < 6) {
                    appSet.setPass.newPassText = '密码不能少于6位';
                    dispatch({ type: appSetWinodw.SET, data: appSet });
                    return;
                }

                if (!appSet.setPass.rePass) {
                    appSet.setPass.rePassText = '请确认密码';
                    dispatch({ type: appSetWinodw.SET, data: appSet });
                    return;
                }

                if (appSet.setPass.rePass != appSet.setPass.newPass) {
                    appSet.setPass.rePassText = '两次密码不正确';
                    dispatch({ type: appSetWinodw.SET, data: appSet });
                    return;
                }
                newPass = appSet.setPass.newPass;
            }

            let param = { age, name, synopsis, ext };


            let oFormData = new FormData();

            oFormData.append('age', age);
            oFormData.append('name', name);
            oFormData.append('synopsis', synopsis);
            oFormData.append('ext', ext);
            newEmail && oFormData.append('email', newEmail);
            newEmail && oFormData.append('verifyEmail', verifyEmail);
            newPass && oFormData.append('password', newPass);
            appSet.setPhoto && oFormData.append('headphoto', appSet.active.headphoto);

            dispatch({ type: appSetWinodw.BTNTEXT, onoff: false, text: '……' });

            let xhr = new XMLHttpRequest();

            xhr.open('POST', url.updateURL, true);
            xhr.responseType = 'json';
            xhr.setRequestHeader('X-Request-With', 'XMLHttpRequest');

            xhr.onload = e => {
                const data = xhr.response;

                dispatch({ type: appSetWinodw.BTNTEXT, onoff: true, text: '提 交' });

                if (!data) {
                    alert('修改失败');
                    reeturn;
                }

                if (!data.success && data.text == 1) {
                    appSet.setEmail.emailText = '请先验证邮箱';
                    dispatch({ type: appSetWinodw.SET, data: appSet });
                    return;
                }

                if (!data.success && data.text == 2) {
                    appSet.setEmail.verifyText = '验证码不正确';
                    dispatch({ type: appSetWinodw.SET, data: appSet });
                    return;
                }

                if (!data.success) {
                    alert('修改失败');
                    return;
                }

                if (data.success) {
                    alert('修改成功');

                    appSet.setEmail.show && (appSet.active.email = appSet.setEmail.newEmail);

                    dispatch({ type: appUserWindow.INITDATA, data: appSet.active });

                    dispatch(appSetWinodw.show());
                }

                xhr = null;
                oFormData = null;
            }

            xhr.send(oFormData);
        }
    }
}