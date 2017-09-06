const md5 = require('md5');

const { tables: { userTable } } = require('../../../public/config');

const { getVerify: getverifyfn } = require('../../../public/fn');

const emailSubmit = require('../../../public/email');

const repEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

// 缺少参数 0   
// 验证码不正确 1
// 用户名不符合条件 2
// 邮箱地址不符号条件 3
// 密码不符合条件 4
// 邮箱验证码发送失败 5
// 超时 6
// 非法操作 没有进行 第一步操作 7
// 邮箱验证码不正确 8
// 注册失败 9
module.exports = function (req, res, next) {
    const { stop } = req.body;

    const stop1 = () => {

        const { username, email, password, verify } = req.body;

        const regverify = req.getSession('regverify');

        const time = Date.now();

        if (!username || !email || !password || !verify) {
            // 缺少参数 0
            res.json({ success: false, text: 0 });
            return;
        }
        if (verify != regverify) {
            // 验证码不正确 1
            res.json({ success: false, text: 1 });
            return;
        }
        if (/\W/.test(username) || username.length < 6 || username.length > 16) {
            // 用户名不符合条件 2
            res.json({ success: false, text: 2 });
            return;
        }
        if (!repEmail.test(email)) {
            // 邮箱地址不符号条件 3
            res.json({ success: false, text: 3 });
            return;
        }
        if (password.length > 20 || password < 6) {
            // 密码不符合条件 4
            res.json({ success: false, text: 4 });
            return;
        }

        // 检查用户名 或者 邮箱是否存在 多加一步
        req.dbSelect(userTable, { where: `username='${username}' or email='${email}'` }).then((data) => {
            if (data[0]) {
                if (data.length > 1) {
                    // 用户名和邮箱都存在
                    res.json({ success: false, text: 10 });
                }
                else if (data[0].username == username) {
                    // 用户名已经存在
                    res.json({ success: false, text: 11 });
                }
                else if (data[0].email == email) {
                    // 邮箱已经存在
                    res.json({ success: false, text: 12 });
                }
                else {
                    // 特殊情况 系统错误
                    res.json({ success: false, text: 13 });
                }
                return;
            }

            const sqldata = {
                username,
                password: md5(password),
                headphoto: '/image/default.jpg',
                resdate: time,
                email,
                synopsis: '',
                logindate: time,
                loginnum: 1,
                name: ''
            }

            getVerify(email).then((vstr) => {
                req.setSession('vegisterEmail', vstr).then(() => {
                    return req.setSession('registerData', sqldata);
                }).then(() => {
                    res.json({ success: true });
                }).catch(() => {
                    req.logErr('邮箱验证码发送失败');
                    res.json({ success: false, text: 5 });
                });
            }).catch(() => {
                req.logErr('邮箱验证码发送失败');
                res.json({ success: false, text: 5 });
            });
        })

    }

    const stop2 = () => {
        const { vegisterEmail, registerData } = req.getSession();

        const { emailVerify } = req.body;

        const time = Date.now();

        if (!registerData || !vegisterEmail) {
            // 非法操作 没有进行 第一步操作 7
            res.json({ success: false, text: 7 });
            return;
        }

        if (time - registerData.logindate > 300000) {
            // 超时 6
            res.json({ success: false, text: 6 });
            return;
        }

        if (typeof emailVerify != 'string' || vegisterEmail.toLowerCase() != emailVerify.toLowerCase()) {
            // 邮箱验证码不正确 8
            res.json({ success: false, text: 8 });
            return;
        }

        req.dbInsert(userTable, registerData).then((data) => {
            // req.setSession('login', true).then(() => {
            //     res.json({ success: true });
            // }).catch(() => {
            //     res.json({ success: false });
            // })

            res.json({ success: true });
        }).catch((err) => {
            req.logErr('注册失败');
            res.json({ success: false, text: 9 });
        });
    }

    const stop3 = () => {
        let { vegisterEmail, registerData } = req.getSession();

        if (!registerData || !vegisterEmail) {
            res.json({ success: false, text: 7 });
            return;
        }

        getVerify(registerData.email).then((vstr) => {
            req.setSession('vegisterEmail', vstr).then(() => {
                const time = Date.now();
                registerData.resdate = time;
                registerData.logindate = time;
                return req.setSession('registerData', registerData);
            }).then(() => {
                res.json({ success: true });
            }).catch(() => {
                req.logErr('邮箱验证码发送失败');
                res.json({ success: false, text: 5 });
            });
        }).catch(() => {
            req.logErr('邮箱验证码发送失败');
            res.json({ success: false, text: 5 });
        });
    }

    if (stop == 1) {
        stop1();
    }
    else if (stop == 2) {
        stop2();
    }
    else if (stop == 3) {
        stop3();
    }
    else {
        res.status('404');
        res.json({ err: '非法访问' });
    }
}

function getVerify(email) {
    const vstr = getverifyfn(6, true);
    return new Promise((resolve, reject) => {
        emailSubmit(email, '程序注册', '验证码', '<h1>' + vstr + '</h1>').then(() => {
            resolve(vstr);
        }).catch(() => {
            reject();
        })
    })
}