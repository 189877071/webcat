
const { tables: { loginTable } } = require('../../../public/config');

module.exports = function (req, res, next) {

    const { operation, udphost, udpport, socketid } = req.body;

    const { login } = req.getSession();

    if (!udphost || !udpport || !socketid) {
        res.json({ success: false });
        return;
    }

    if (!login || !login.id) {
        res.json({ success: true });
        return;
    }

    const id = login.id;

    if (operation == 1) {
        req.removeSession('login').then(() => res.json({ success: true })).catch(() => res.json({ success: false }));
    }
    else if (operation == 2) {
        removeSession().then(removeLoginData).then(getLoginUser).then(sendExit);
    }
    else {
        res.status(404);
        res.json({ err: '您访问的页面不存在' });
    }

    // 删除session
    function removeSession() {
        return new Promise(reslove => req.removeSession('login').then(reslove).catch(() => res.json({ success: false })));
    }

    // 删除当前用户的登录数据
    function removeLoginData() {
        return new Promise(reslove => {
            req.dbDelete(loginTable, `userid=${id}`)
            .then(() => {
                reslove();
            })
            .catch(() => {
                req.logErr(`删除当前用户的登录数据失败`);
                res.json({ success: false });
            })
        })
    }

    // 获取到所有在线用户
    function getLoginUser() {
        return new Promise(reslove => {
            req.dbSelect(loginTable, { cols: 'socketid,host,port' })
            .then(data => reslove(data))
            .catch(() => { 
                req.logErr(`获取登录的用户失败`);
                res.json({ success: false });
            })
        })
    }

    // 发送通知 有人下线了
    function sendExit(data) {
        return new Promise(reslove => {
            res.json({ success: true });
            data.forEach(item => req.udpSend({operation: 'useroffline', id: item.socketid, userid: id}, item.port, item.host));
        });
    }
}