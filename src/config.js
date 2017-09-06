import { browserHistory, hashHistory } from 'react-router'

export default {
    history: browserHistory,
    url: {
        activeuserdataURL: '/server/user/active',
        imgVerifyURL: '/server/verify/img',
        verifyUserURL: '/server/verify/useroremail',
        registerURL: '/server/login/reg',
        loginURL: '/server/login/login',
        exitURL: '/server/login/exit',
        allDataURL: '/server/user/all',
        sendURL: '/server/user/send',
        catlogURL: '/server/user/catlog',
        updatepassURL: '/server/login/updatepass',
        emailVerifyURL: '/server/verify/emailVerify',
        updateURL: '/server/user/updateInfor',
        // socketURL: 'http://socket.webcat.com'
        socketURL: 'http://socket.webcat.com'
    }
}

