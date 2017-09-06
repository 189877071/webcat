const md5 = require('md5');

const { tables: { autologinTable, userTable, loginTable }, master: { socket } } = require('../../../public/config');

module.exports = function (req, res, next) {
    const login = req.getSession('login');

    const device = 'browser';

    const { key, socketid, udphost, udpport, browserkey } = req.body;

    const browser = md5(req.headers[`user-agent`]);

    let userId = null;

    if (!socketid || !udphost || !udpport) {
        res.json({ login: false });
    }
    else if (login && login.id) {
        // 执行这段程序表明当前用户已经注册过了
        // 如果同时还有用户在其他浏览器中登录，只有一个可能就是，用户登录完成与已经登录的浏览器同时执行完成
        // 最保守的方式还是，要发送一个通知
        // 那先，发送通知还是，后修改后发送通知
        // 先查询登录数据
        // 再发送通知
        // 修改登录数据
        // 查询用户数据
        // 输出结果
        userId = login.id;

        selectUserLogin()
            .then(sendExit)
            .then(updateUserLogin)
            .then(selectUser)
            .then(userData => res.json({ login: true, userData }));
    }
    else if (key) {
        // 执行此段表示，当前用户没有登录
        // 先通过 key 值 查询到 用户的id
        // 先查询用户登录信息
        // 如果用户登录过则通过req.udpSend 发送到指定的socket 进程 让当前登录用户 退出
        // 修改 或者 插入 登录信息
        // 获取用户数据
        // 输出
        selectAutoLogin()
            .then(updateAutoLoginTime)
            .then(selectUserLogin)
            .then(sendExit)
            .then(updateUserLogin)
            .then(selectUser)
            .then(setSessionLogin)
            .then(userData => res.json({ login: true, userData }));
    }
    else {
        res.json({ login: false });
    }

    // 查询用户登录表数据
    function selectUserLogin() {
        return new Promise(reslove => {
            req.dbSelect(loginTable, {
                where: `userid=${userId} and device='${device}'`
            }).then(data => reslove(data[0])).catch(() => {
                res.logErr(`查询${loginTable}时出现错误`);
                res.json({ login: false });
            })
        });
    }

    // 发送 其他浏览器登录退出通知
    function sendExit(data) {
        return new Promise(reslove => {
            if (!data) {
                reslove();
                return;
            }
            req.udpSend({ operation: 'propose', id: data.socketid, key: browserkey }, data.port, data.host).then(() => reslove(data)).catch(() => {
                req.logErr('发送其他浏览器登录退出通知失败');
                res.json({ login: false });
            })
        })
    }

    // 修改用户登录信息 如果 data存在就修改，如果不存在就添加
    function updateUserLogin(data) {
        return new Promise(reslove => {
            if (data) {
                req.dbUpdate(loginTable, `id=${data.id}`, {
                    socketid, host: udphost, port: udpport, otime: Date.now()
                }).then(reslove).catch(() => {
                    req.logErr(`修改${loginTable}表数据出错`);
                    res.json({ login: false });
                })
            }
            else {
                req.dbInsert(loginTable, {
                    socketid, userid: userId, host: udphost, port: Number(udpport), device, otime: Date.now()
                }).then(() => sendonline(0, reslove)).catch(() => {
                    req.logErr(`${loginTable}表插入数据失败`);
                    res.json({ login: false });
                })
            }
        })
    }

    // 查询用户数据
    function selectUser() {
        return new Promise(reslove => {
            req.dbSelect(userTable, {
                where: `id=${userId}`,
                cols: 'id,username,headphoto,email,synopsis,ext,age,logindate,name'
            }).then(data => {
                if (!data[0]) {
                    res.json({ login: false });
                    return;
                }
                reslove(data[0]);
            }).catch(() => {
                req.logErr(`查询${userTable}表出现错误`);
                res.json({ login: false });
            })
        })
    }

    // 设置session 登录验证
    function setSessionLogin(data) {
        return new Promise(reslove => {
            req.setSession('login', { id: userId }).then(() => reslove(data)).catch(() => {
                res.json({ login: false });
            });
        })
    }

    // 查询用户自动登录表
    function selectAutoLogin() {
        return new Promise(reslove => {
            req.dbSelect(autologinTable, `okey='${key}' and browser='${md5(req.headers[`user-agent`])}'`).then(data => {
                if (!data[0]) {
                    res.json({ login: false });
                    return;
                }
                userId = data[0].userid;
                reslove(data[0].id);
            }).catch(() => {
                req.logErr(`查询${autologinTable}表出错`);
                res.json({ login: false });
            })
        })
    }

    // 修改 用户自动登录表 时间
    function updateAutoLoginTime(id) {
        return new Promise(reslove => {
            req.dbUpdate(autologinTable, `id=${id}`, { otime: Date.now() }).then(reslove).catch(() => {
                req.logErr(`修改用户${autologinTable}表中时间出错`);
                res.json({ login: false });
            })
        })
    }

    // 上线通知
    function sendonline(num, reslove) {
        if (num >= socket.length) {
            reslove();
            return;
        }
        req.udpSend({ operation: 'useronline', id: userId }, socket[num].udpport, socket[num].udphost)
            .then(() => sendonline(++num, reslove))
            .catch(() => {
                req.logErr(`发送登录通知失败：udp端口${socket[num].udpport}、udp主机${socket[num].udphost}`);
                sendonline(++num, reslove);
            })
    }
}