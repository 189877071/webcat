import { activeDataState, catDataState, setState } from './state'

import { appUserWindow, appCatWindow, APPZINDEXACTION, appSetWinodw } from './action'

export function appActive(state = activeDataState, action) {

    let obj = $.extend(true, {}, state);

    switch (action.type) {
        case appUserWindow.INITDATA:
            obj.active = action.data;
            return obj;
        case appUserWindow.ALLUSERDATA:
            obj.users = action.users;
            return obj;
        case appUserWindow.SETZINDEX:
            obj.zindex = action.num;
            return obj;
        case appUserWindow.AUDIO:
            obj.audio = action.off;
            return obj;
        default:
            return state;
    }
}

export function appCat(state = catDataState, action) {
    let obj = $.extend(true, {}, state);
    switch (action.type) {
        case appCatWindow.RELIST:
            obj.list = action.list;
            return obj;
        case appCatWindow.REBOXLIST:
            obj.boxList = action.list;
            return obj;
        case appCatWindow.BOXACTIVE:
            obj.boxActive = action.num;
            return obj;
        case appCatWindow.BOXZINDEX:
            obj.boxZindex = action.num;
            return obj;
        case appCatWindow.FILTER:
            obj.filter = action.value;
            return obj;
        case appCatWindow.VIDEOCALL:
            obj.videoCall = action.data;
            return obj;
        case appCatWindow.AUDIOCALL:
            obj.audioCall = action.data;
            return obj;
        case appCatWindow.SENDFILE:
            obj.file = action.data;
            return obj;
        case appCatWindow.SHOWIMG:
            obj.showImg = action.data;
            return obj;
        default:
            return state;
    }
}

export function appZindex(state = 0, action) {
    switch (action.type) {
        case APPZINDEXACTION:
            return state + 1;
        default:
            return state;
    }
}

export function appSet(state = setState, action) {
    let obj = $.extend(true, {}, state);

    switch (action.type) {
        case appSetWinodw.SET:
            return action.data;
        case appSetWinodw.SETNAME:
            obj.active.name = action.value.length > 10 ? action.value.slice(0, 10) : action.value;
            return obj;
        case appSetWinodw.SETNEWEMAIL:
            obj.setEmail.newEmail = action.value;
            return obj;
        case appSetWinodw.SETNEWEMAILVERIFY:
            obj.setEmail.verify = action.value;
            return obj;
        case appSetWinodw.SETNEWPASS:
            obj.setPass.newPass = action.value.length > 16 ? action.value.slice(0, 16) : action.value;
            return obj;
        case appSetWinodw.SETREPASS:
            obj.setPass.rePass = action.value;
            return obj;
        case appSetWinodw.SETAGE:
            obj.active.age = !isNaN(Number(action.value)) && action.value < 150 ? action.value : obj.active.age;
            return obj;
        case appSetWinodw.SETEXT:
            obj.active.ext = action.value;
            return obj;
        case appSetWinodw.SETSYNOPSIS:
            obj.active.synopsis = action.value.length > 150 ? action.value.slice(0, 150) : action.value;
            return obj;
        case appSetWinodw.SETEEMAILTEXT:
            obj.setEmail.emailText = '';
            return obj;
        case appSetWinodw.SETEMAILVERIFYTEXT:
            obj.setEmail.verifyText = '';
            return obj;
        case appSetWinodw.SETNEWPASSTEXT:
            obj.setPass.newPassText = '';
            return obj;
        case appSetWinodw.SETREPASSTEXT:
            obj.setPass.rePassText = '';
            return obj;
        case appSetWinodw.BTNTEXT:
            obj.onoff = action.onoff;
            obj.btnText = action.text;
            return obj;
        case appSetWinodw.UPDATEPHOTO:
            obj.upatePhoto = action.onoff;
            return obj;
        case appSetWinodw.SETIMGSRC:
            obj.img = action.data;
            return obj;
        case appSetWinodw.SETIMGACTIVE:
            obj.imgActive = action.num;
            return obj;
        case appSetWinodw.SETHEADPHOTO:
            obj.active.headphoto = obj.img[obj.imgActive];
            obj.setPhoto = action.setPhoto;
            return obj;
        default:
            return state;
    }
}