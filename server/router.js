const img = require('./modules/verify/imgVerify');

const useroremail = require('./modules/verify/verifyUserOrEmail');

const reg = require('./modules/login/register');

const login = require('./modules/login/login');

const updatepass = require('./modules/login/updatepassword');

const exit = require('./modules/login/exit');

const active = require('./modules/user/activeUserData');

const all = require('./modules/user/allData');

const send = require('./modules/user/send');

const catlog = require('./modules/user/catLog');

const emailVerify = require('./modules/verify/emailVerify');

const updateInfor = require('./modules/user/updateInfor');

const users = require('./modules/login/users');

module.exports = {
    verify: {
        useroremail, // 验证月用户名邮箱发送存在
        img, // 获取图片验证码
        emailVerify
    },
    login: {
        reg, // 注册
        login,
        updatepass,
        exit,
        users
    },
    user: {
        active,
        all,
        send,
        catlog,
        updateInfor
    }
}



