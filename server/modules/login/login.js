
const md5 = require('md5');

const { tables: { userTable, autologinTable, loginTable }, master: { socket } } = require('../../../public/config');

const email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

// text: 1; 没有用户名参数
// text: 2; 没有密码参数
// text: 3; 没有验证码参数
// text: 4; 用户名格式不正确
// text: 5; 验证码不正确;
// text: 6; 用户名不存在
// text: 7; 密码不正确
// text: 8, 9, 10, 11 数据查询报错

module.exports = function (req, res, next) {

    const { username, password, verify, delayed, socketid, udphost, udpport } = req.body;
   
    const { loginverify } = req.getSession();

    // 设备有 'browser' 和 'app'
    const device = 'browser';

    let key = 'username';

    let userid = '';

    let userData = null;


    function start() {
        if (!username) {
            res.json({ success: false, text: 1 });
            return;
        }

        if (!password) {
            res.json({ success: false, text: 2 });
            return;
        }

        if (!verify) {
            res.json({ success: false, text: 3 });
            return;
        }

        if (email.test(username)) {
            key = 'email';
        }
        else if (/\W/.test(username)) {
            res.json({ success: false, text: 4 });
            return;
        }
        
        if (loginverify != verify) {
            res.json({ success: false, text: 5 });
            return;
        }

        isDbUsername()
            .then(updateDelayed)
            .then(updateUser)
            .then(selectUserLogin)
            .then(insertUserLogin)
            .then(setSessionToLogin);
    }

    function isDbUsername() {
        return new Promise((reslove, reject) => {
            req.dbSelect(userTable, { where: `${key}='${username}'` }).then((data) => {
                if (!data[0]) {
                    res.json({ success: false, text: 6 });
                    return;
                }

                if (data[0].password != md5(password)) {
                    res.json({ success: false, text: 7 });
                    return;
                }

                userData = data[0];

                reslove(data[0]);
            }).catch(() => {
                req.logErr('查询用户名与密码是否正确时出错');
                res.json({ success: false, text: 8 });
            });
        })
    }

    function updateDelayed(data) {
        return new Promise((reslove, reject) => {
            if (!delayed) {
                reslove(data);
                return;
            }
            req.dbInsert(autologinTable, { userid: data.id, okey: delayed, otime: Date.now(), browser: md5(req.headers[`user-agent`]) }).then(() => {
                console.log(data);
                reslove(data);
            }).catch(() => {
                req.logErr('添加自动登录信息失败');
                res.json({ success: false, text: 11 });
            })
        })
    }

    function updateUser(data) {
        userid = data.id;

        const sqlData = {
            logindate: Date.now(),
            loginnum: ++data.loginnum
        }

        return new Promise((reslove, reject) => {
            req.dbUpdate(userTable, `username='${username}'`, sqlData).then(() => {
                reslove();
            }).catch(() => {
                req.logErr('登录修改信息时出错');
                res.json({ success: false, text: 9 });
            });
        });

    }

    function selectUserLogin() {
        return new Promise((reslove, reject) => {
            req.dbSelect(loginTable, { where: `userid=${userid} and device='${device}'` }).then((data) => {
                reslove(data[0]);
            }).catch(() => {
                req.logErr('查询cat_socketloginuser表数据出错');
                res.json({ success: false, text: 10 });
            })
        })
    }

    function insertUserLogin(data) {
        return new Promise((reslove, reject) => {

            // 如果登录了 就修改，没有登录就插入
            if (data) {
                req.dbUpdate(loginTable, `id=${data.id}`, { host: udphost, socketid, port: Number(udpport), otime: Date.now(), device }).then(() => {
                    req.udpSend({ operation: 'propose', id: data.socketid }, data.port, data.host).then(() => {
                        reslove();
                    }).catch(() => {
                        req.logErr('udp数据发送失败');
                        res.json({ success: false, text: 11 });
                    });
                }).catch(() => {
                    req.logErr('修改cat_socketloginuser表数据出错');
                    res.json({ success: false, text: 2 });
                });
            }
            else {
                req.dbInsert(loginTable, { host: udphost, socketid, port: Number(udpport), userid, otime: Date.now(), device }).then(() => {
                    getLoginUser().then(sendOnLine).then(reslove);
                }).catch(() => {
                    req.logErr('添加cat_socketloginuser表数据出错');
                    res.json({ success: false, text: 3 });
                })
            }
        })
    }

    function setSessionToLogin() {
        req.setSession('login', { id: userid }).then(() => {
            res.json({ success: true, userData });
        }).catch(() => {
            res.json({ success: false, text: 10 });
        });
    }


    // 获取到所有登录用户
    function getLoginUser() {
        return new Promise(reslove => {
            req.dbSelect(loginTable, { 
                cols: 'socketid,host,port',
                where: `userid!=${userid}` 
            })
            .then(data => reslove(data))
            .catch(() => { 
                req.logErr(`获取登录的用户失败`);
                res.json({ success: false });
            })
        })
    }

    // 发送通知 有人上线了
    function sendOnLine(data) {
        return new Promise(reslove => {
            data.forEach(item => req.udpSend({operation: 'useronline', id: item.socketid, userid}, item.port, item.host));
            reslove();
        });
    }

    start();
}