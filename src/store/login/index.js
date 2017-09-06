import { login, register, mask } from './state'

import { loginIndexAction, loginRegisterAction, loginMaskAction, LOGINONOFFACTION } from './action'


export function loginIndex(state = login, action) {

    let obj = $.extend(true, {}, state);

    switch (action.type) {
        case loginIndexAction.USERONCHANGE:
            obj.user.value = action.value;
            return obj;
        case loginIndexAction.PASSONCHANGE:
            obj.pass.value = action.value;
            return obj;
        case loginIndexAction.VERIFYONCHANGE:
            obj.verify.value = action.value;
            return obj;
        case loginIndexAction.SHOWIMGVERIFY:
            obj.imgbox = action.h;
            return obj;
        case loginIndexAction.DELAYEDONCHANGE:
            obj.delayed = action.onoff;
            return obj;
        case loginIndexAction.INIT:
            return action.state;
        case loginIndexAction.STTVERIFYUSER:
            obj.user.text = action.text;
            obj.user.success = action.success;
            return obj;
        case loginIndexAction.SETVERIFYPASS:
            obj.pass.text = action.text;
            obj.pass.success = action.success;
            return obj;
        case loginIndexAction.SETVERIFYIMG:
            obj.verify.text = action.text;
            obj.verify.success = action.success;
            return obj;
        case loginIndexAction.SETDELAYEDKEY:
            obj.key = action.key;
            return obj;
        case loginIndexAction.SETSTOP:
            obj.stop = action.stop;
            return obj;
        default:
            return state;
    }
}

export function loginRegister(state = register, action) {
    let obj = $.extend(true, {}, state);

    switch (action.type) {
        case loginRegisterAction.USERONCHANGE:
            obj.user.value = action.value;
            return obj;
        case loginRegisterAction.EMAILONCHANGE:
            obj.email.value = action.value;
            return obj;
        case loginRegisterAction.PASSONCHANGE:
            obj.pass.value = action.value;
            return obj;
        case loginRegisterAction.REPASSONCHANGE:
            obj.repass.value = action.value;
            return obj;
        case loginRegisterAction.VERIFYONCHANGE:
            obj.verify.value = action.value;
            return obj;
        case loginRegisterAction.EMAILVONHANGE:
            obj.emailv.value = action.value;
            return obj;
        case loginRegisterAction.INIT:
            return action.state;
        case loginRegisterAction.SHOWPASSBOX:
            obj.passbox = action.h;
            return obj;
        case loginRegisterAction.SHOWIMGBOX:
            obj.imgbox = action.h;
            return obj;
        case loginRegisterAction.SHOWEMAILVBOX:
            obj.emailvbox = action.h;
            return obj;
        case loginRegisterAction.USERALREADYREG:
            obj.user.text = action.text;
            obj.user.success = action.success;
            return obj;
        case loginRegisterAction.EMAILALREADYREG:
            obj.email.text = action.text;
            obj.email.success = action.success;
            return obj;
        case loginRegisterAction.UNVERIFYPASS:
            obj.pass.text = action.text;
            obj.pass.success = action.success;
            return obj;
        case loginRegisterAction.UNVERIFYREPASS:
            obj.repass.text = action.text;
            obj.repass.success = action.success;
            return obj;
        case loginRegisterAction.UNVERIFYVERIFY:
            obj.verify.text = action.text;
            obj.verify.success = action.success;
            return obj;
        case loginRegisterAction.UNVERIFYEMAILV:
            obj.emailv.text = action.text;
            obj.emailv.success = action.success;
            return obj;
        case loginRegisterAction.SETSTOP:
            obj.stop = action.stop;
            return obj;
        case loginRegisterAction.SETTIME:
            obj.time = action.t;
            return obj;
        case loginRegisterAction.SETSUBMITTEXT:
            obj.submit = action.text;
            return obj;
        case loginRegisterAction.SETJUMP:
            obj.jump = action.t;
            return obj;
        default:
            return state;
    }
}

export function loginMask(state = mask, action) {
    let obj = $.extend(true, {}, state);

    switch (action.type) {
        case loginMaskAction.ANDROID:
            obj.android.display = action.display;
            return obj;
        case loginMaskAction.WEB:
            obj.web.display = action.display;
            return obj;
        case loginMaskAction.IOS:
            obj.ios.display = action.display;
            return obj;
        case loginMaskAction.UPDATEPASS:
            obj.updatepass.display = action.display;
            return obj;
        case loginMaskAction.INIT:
            return action.state;
        case loginMaskAction.UPDATEPASSEMAILONCHANGE:
            obj.updatepass.email.value = action.value;
            return obj;
        case loginMaskAction.UPDATEPASSPASSONCHANGE:
            obj.updatepass.pass.value = action.value;
            return obj;
        case loginMaskAction.UPDATEPASSREPASSONCHANGE:
            obj.updatepass.repass.value = action.value;
            return obj;
        case loginMaskAction.UPDATEPASSVERIFYONCHANGE:
            obj.updatepass.verify.value = action.value;
            return obj;
        case loginMaskAction.UPDATEPASSEMAILTEXT:
            obj.updatepass.email.text = action.text;
            obj.updatepass.email.success = action.success;
            return obj;
        case loginMaskAction.UPDATEPASSSTEP:
            obj.updatepass.step = action.step;
            return obj;
        case loginMaskAction.UPDATEPASSEMAILSUBMIT:
            obj.updatepass.emailSubmit = action.text;
            return obj;
        case loginMaskAction.UPDATEPASSPASSTEXT:
            obj.updatepass.pass.text = action.text;
            obj.updatepass.pass.success = action.success;
            return obj;
        case loginMaskAction.UPDATEPASSREPASSTEXT:
            obj.updatepass.repass.text = action.text;
            obj.updatepass.repass.success = action.success;
            return obj;
        case loginMaskAction.UPDATEPASSVERIFYTEXT:
            obj.updatepass.verify.text = action.text;
            obj.updatepass.verify.success = action.success;
            return obj;
        case loginMaskAction.UPDATEPASSSUBMIT:
            obj.updatepass.submit = action.text;
            return obj;
        case loginMaskAction.GETUSERS:
            obj.getusers = action.onoff;
            return obj;
        default:
            return state;
    }
}

export function loginOnoff(state = false, action) {
    switch (action.type) {
        case LOGINONOFFACTION:
            return action.onoff;
        default:
            return state;
    }
}