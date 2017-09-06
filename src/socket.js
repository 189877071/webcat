import { url, history } from './config'

import { LOGINONOFFACTION, loginIndexAction } from './store/login/action'

import { LOADERINITACTION } from './store/loader/action'

import { login } from './store/login/state'

import { appUserWindow, appCatWindow, APPZINDEXACTION, getCatLog } from './store/app/action'

window.socketInit = null;

window.socket = io(url.socketURL);

export default function (store) {

    const { dispatch, getState } = store;

    function communication(data, operation) {

        return new Promise(reslove => {
            // data = {content: 'sdp,ice信息', sendid: '发送人id'}
            const state = $.extend(true, {}, getState());

            // 先判断是不是正在通话中
            if (state.appCat.videoCall.show || state.appCat.audioCall.show) {
                // 正在通话中
                fetch(url.sendURL, setFetchPost({
                    content: JSON.stringify({ success: false, text: 1 }),
                    receiveid: data.sendid,
                    operation
                }));
                return;
            }

            let [user, active, users] = [
                null,
                state.appActive.active,
                state.appActive.users
            ];

            for (let i = 0; i < users.length; i++) {
                if (users[i].id === data.sendid) {
                    user = users[i];
                    break;
                }
            }

            if (!user) {
                return;
            }

            const content = JSON.parse(data.content);

            if (!content.sdp || !content.ice) {
                alert('缺失SDP/ICE数据,无法连接0000');
                return;
            }

            reslove(content);
        })
    }

    function communicationCallback(data, callData, type) {
        return new Promise(reslove => {
            if (!data) {
                alert('请求失败');
                return;
            }

            if (data.sendid !== callData.id) {
                return;
            }

            const content = JSON.parse(data.content);

            if (content.text == 2) {
                alert('对方拒绝了你的请求');
                dispatch({ type, data: {} });
                clearInterval(callData.time);
                return;
            }

            if (content.text == 3) {
                alert('对方取消了通话');
                dispatch({ type, data: {} });
                clearInterval(callData.time);
                return;
            }

            if (!content.sdp || !content.ice) {
                alert('缺失SDP/ICE数据,无法连接');
                return;
            }

            reslove(content);
        })
    }

    // 初始化登录信息 initLoginData 
    socket.on('initLoginData', function (data) {
        socketInit = data;

        let param = { ...data };

        if (window.localStorage) {
            let autoLogin = localStorage.getItem('autoLogin');

            if (autoLogin) param.key = autoLogin;

            let browserkey = localStorage.getItem('browserkey');

            if (!browserkey) {
                browserkey = Date.now() + '-' + setAutoLoginKey(5);
                localStorage.setItem('browserkey', browserkey);
            }

            param.browserkey = browserkey;
        }

        fetch(url.activeuserdataURL, setFetchPost(param)).then(fetchResCallback).then((data) => {

            dispatch({ type: LOADERINITACTION });

            if (!data || !data.login) {
                window.localStorage && localStorage.removeItem('autoLogin');
                dispatch({ type: LOGINONOFFACTION, onoff: false });
            }
            else {
                dispatch({ type: appUserWindow.INITDATA, data: data.userData });
                dispatch({ type: LOGINONOFFACTION, onoff: true });
            }
        })
    });

    // 在其他地方登录当前登录被踢出 propose
    socket.on('propose', function (data) {
        if (window.localStorage && data.browserkey == localStorage.getItem('browserkey')) {
            location.href = '/alreadylogin.html';
            return;
        }
        fetch(url.exitURL, setFetchPost({ operation: 1 })).then(fetchResCallback).then((data) => {
            if (data && data.success) {
                window.localStorage && localStorage.removeItem('autoLogin');

                dispatch({ type: LOGINONOFFACTION, onoff: false });

                dispatch({ type: loginIndexAction.INIT, state: $.extend(true, {}, login) });

                history.push('/login');
            }
        });
    });

    // 有用户上线 userOnLine
    socket.on('userOnLine', function (data) {

        const state = $.extend(true, {}, getState());

        const [users, list, boxlist, active, audio] = [
            state.appActive.users,
            state.appCat.list,
            state.appCat.boxList,
            state.appActive.active,
            state.appActive.audio
        ];

        if (!active.id || active.id == data.id || !users.length) return;

        for (let i = 0; i < users.length; i++) {
            let item = users[i];

            if (item.id == data.id) {
                item.login = 1;
                let oItem = users.splice(i, 1);
                users.unshift(oItem[0]);
                dispatch({ type: appUserWindow.ALLUSERDATA, users });
                notice('上线通知', `好友“${item.name ? item.name : item.username}” 上线啦`, oItem[0].headphoto);
                if (audio) $('#online').get(0).play();
                break;
            }
        }


        for (let i = 0; i < boxlist.length; i++) {
            if (boxlist[i].id == data.id) {
                boxlist[i].login = 1;
                dispatch({ type: appCatWindow.REBOXLIST, list: boxlist });
                return;
            }
        }

        for (let i = 0; i < list.length; i++) {
            if (list[i].id == data.id) {
                list[i].login = 1;
                dispatch({ type: appCatWindow.RELIST, list });
                return;
            }
        }

    });

    // 有用户离线 userOffLine;
    socket.on('userOffLine', function (data) {

        const state = $.extend(true, {}, getState());

        const [users, list, boxlist, active, audio] = [
            state.appActive.users,
            state.appCat.list,
            state.appCat.boxList,
            state.appActive.active,
            state.appActive.audio
        ];

        if (!active.id || active.id == data.id || !users.length) return;

        for (let i = 0; i < users.length; i++) {
            let item = users[i];
            if (item.id == data.id) {

                item.login = 0;
                users.splice(i, 1);

                for (let j = 0; j < users.length; j++) {
                    if (users[j].login == 0) {
                        users.splice(j, 0, item);
                        break;
                    }
                }
                dispatch({ type: appUserWindow.ALLUSERDATA, users });

                if (audio) $('#online').get(0).play();

                break;
            }
        }

        for (let i = 0; i < boxlist.length; i++) {
            if (boxlist[i].id == data.id) {
                boxlist[i].login = 0;
                dispatch({ type: appCatWindow.REBOXLIST, list: boxlist });
                return;
            }
        }

        for (let i = 0; i < list.length; i++) {
            if (list[i].id == data.id) {
                list[i].login = 0;
                dispatch({ type: appCatWindow.RELIST, list });
                return;
            }
        }

    });

    // 消息 shortMessage
    socket.on('shortMessage', function (data) {

        const state = $.extend(true, {}, getState());

        let [boxList, list, users, zIndex, cord, miId, audio] = [
            state.appCat.boxList,
            state.appCat.list,
            state.appActive.users,
            state.appZindex,
            { content: data.content, send: 1, time: Date.now() },
            state.appActive.active.id,
            state.appActive.audio
        ];

        if (audio) $('#message').get(0).play();

        for (let i = 0; i < list.length; i++) {
            if (list[i].id == data.sendid) {
                list[i].record.push(cord);
                dispatch({ type: appCatWindow.RELIST, list });
                return;
            }
        }

        for (let i = 0; i < boxList.length; i++) {
            if (boxList[i].id == data.sendid) {
                boxList[i].record.push(cord);
                boxList[i].inforActive = true;
                dispatch({ type: appCatWindow.REBOXLIST, list: boxList });
                return;
            }
        }

        for (let i = 0; i < users.length; i++) {
            if (users[i].id == data.sendid) {
                users[i].leaveInfor ? users[i].leaveInfor++ : users[i].leaveInfor = 1;
                dispatch({ type: appUserWindow.ALLUSERDATA, users: users });
                return;
            }
        }
    });

    // 请求视频通讯 videoCommunication
    socket.on('videoCommunication', function (data) {
        communication(data, 'videoCommunicationCallback').then((content) => {
            window.videoCallData.config = content;
            dispatch(appCatWindow.videoCallShow(data.sendid, 2));
        });
    });

    // 视频通讯回答信息 videoCommunicationCallback
    socket.on('videoCommunicationCallback', function (data) {
        clearInterval(videoCallData.time);
        communicationCallback(data, window.videoCallData, appCatWindow.VIDEOCALL).then(content => {
            fetch(url.sendURL, setFetchPost({
                operation: 'childVideoCallback', //子页面接收消息 childVideoCallback
                receiveid: window.videoCallData.id,
                socket: JSON.stringify(window.videoCallData.socket),
                content: JSON.stringify({ sdp: content.sdp, ice: content.ice })
            }));
        });
    });

    socket.on('audioCommunication', function (data) {
        communication(data, 'audioCommunicationCallback').then((content) => {
            window.audioCallData.config = content;
            dispatch(appCatWindow.audioCallShow(data.sendid, 2));
        });
    });

    socket.on('audioCommunicationCallback', function (data) {
        communicationCallback(data, window.audioCallData, appCatWindow.AUDIOCALL).then(content => {
            clearInterval(audioCallData.time);
            fetch(url.sendURL, setFetchPost({
                operation: 'childVideoCallback', //子页面接收消息 childVideoCallback
                receiveid: window.audioCallData.id,
                socket: JSON.stringify(window.audioCallData.socket),
                content: JSON.stringify({ sdp: content.sdp, ice: content.ice })
            }));
        });
    });
}