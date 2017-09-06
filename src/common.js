require('es6-promise').polyfill();

require('isomorphic-fetch');

import { url } from './config'

window.setMarginTop = function (obj) {
    const H = document.documentElement.clientHeight;
    const objH = obj.clientHeight;
    obj.style.marginTop = (H - objH) / 2.2 + 'px';
}

window.getActive = function (operation) {
    return operation === 'reg' ? 1 : 0;
}

window.setClass = function (data) {
    let str = ''
    if (!data.success && data.text !== '') {
        str = 'error';
    }
    else if (data.success) {
        str = 'success';
    }
    return str;
}

window.paramFn = function (data) {
    let str = '';
    for (let key in data) {
        str += `${key}=${data[key]}&`
    }
    return str.slice(0, str.length - 1);
}

window.fetchResCallback = function (response) {
    try {
        return response.json();
    }
    catch (e) {
        return { success: false, text: '数据解析失败' }
    }
}

window.setFetchPost = function (data) {
    return {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        credentials: 'include',
        body: paramFn(data ? data : {})
    }
}

let regemailCountDown = null;

window.countDownTime = function (time, fn) {
    let t = time;

    clearInterval(regemailCountDown);

    regemailCountDown = setInterval(() => {
        t--;
        if (t <= 0) {
            t = 0;
            clearInterval(regemailCountDown);
        }
        fn && fn(t);
    }, 1000);
}

window.setAutoLoginKey = function (n) {
    const str = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const len = n ? n : Math.ceil(Math.random() * 10 + 90);

    const strLen = str.length;

    let key = '';

    for (let i = 0; i < len; i++) {
        key += str[Math.floor(Math.random() * strLen)];
    }

    return key;
}


window.windowDrag = function (box, header) {
    let [dX, dY, W, H, boxH, boxW, maxY, maxX] = [0, 0, 0, 0, 0];

    const windowMove = (ev) => {
        let [X, Y] = [
            ev.pageX - dX,
            ev.pageY - dY
        ];

        if (X < 0) X = 0;
        if (Y < 0) Y = 0;
        if (X > maxX) X = maxX;
        if (Y > maxY) Y = maxY;

        $(box).css({ left: X, top: Y });
    }

    const windowUp = () => {
        $(window).off('mousemove', windowMove).off('mouseup', windowUp);
    }

    $(header).on('mousedown', function (ev) {
        ev.preventDefault();
        dX = ev.pageX - $(box).offset().left;
        dY = ev.pageY - $(box).offset().top;
        H = $(window).height();
        W = $(window).width();
        boxH = $(box).height();
        boxW = $(box).width();
        maxY = H - boxH;
        maxX = W - boxW;

        $(window).on('mousemove', windowMove).on('mouseup', windowUp);
    })
}

// 提示
window.notice = function (title, body, icon) {
    if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function (status) {
            const n = new Notification(title, { body, icon });

            n.onshow = function () {
                setTimeout(n.close.bind(n), 5000);
            }
        });
    }
}

window.videoCallData = {
    id: null,
    time: null,
    config: null,
    socket: null,
    getConfig(data) {
        if (!Number(window.videoCallData.id)) {
            return;
        }
        window.videoCallData.socket = data.socket;
        fetch(url.sendURL, setFetchPost({
            operation: window.videoCallData.config ? 'videoCommunicationCallback' : 'videoCommunication',
            receiveid: window.videoCallData.id,
            content: JSON.stringify({ sdp: data.sdp, ice: data.ice })
        }));
    }
}

window.audioCallData = {
    id: null,
    time: null,
    config: null,
    socket: null,
    getConfig(data) {

        if (!Number(window.audioCallData.id)) {
            return;
        }

        window.audioCallData.socket = data.socket;

        fetch(url.sendURL, setFetchPost({
            operation: window.audioCallData.config ? 'audioCommunicationCallback' : 'audioCommunication',
            receiveid: window.audioCallData.id,
            content: JSON.stringify({ sdp: data.sdp, ice: data.ice })
        }))
    }
}

window.getDocumentText = function (value) {
    if (!value) {
        return '';
    }
    return value.replace(/<[\s|\d|\w|"|'|=|;|&|$|@|!|~|`|^|*|#|,|.|:|(|)|-]*>/gi, '').replace(/<\/\w*>/gi, '');
}

window.sendImgHandle = function (flieImg) {
    return new Promise(reslove => {

        let [maxW, oimg, oCanvas, reader] = [
            500,
            new Image(),
            document.createElement('canvas'),
            new FileReader()
        ]

        let cxt = oCanvas.getContext('2d');

        reader.onload = function (e) {
            oimg.src = e.target.result;
        }

        oimg.onload = function () {
            let [w, h] = [
                oimg.width,
                oimg.height
            ];

            if (w > maxW) {
                h = h * (maxW / w);
                w = maxW;
            }

            oCanvas.width = w;
            oCanvas.height = h;

            cxt.drawImage(oimg, 0, 0, oimg.width, oimg.height, 0, 0, w, h);

            reslove(oCanvas.toDataURL('image/png'));

            oimg = oCanvas = reader = null;
        }

        reader.readAsDataURL(flieImg);
    })
}

window.loaderImg = function (src, obj) {
    let oImg = new Image();

    oImg.onload = function () {
        $(obj).css('opacity', 0);
        $(obj).attr('src', oImg.src);
        $(obj).animate({ opacity: 1 }, 300);
        oImg = null;
    }

    oImg.onerror = function () {
        oImg = null;
        $(obj).removeAttr('data-src');
    }

    oImg.src = src;
}