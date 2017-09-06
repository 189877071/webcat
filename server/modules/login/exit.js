
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

    if (operation == 1) {
        req.removeSession('login').then(() => res.json({ success: true })).catch(() => res.json({ success: false }));
    }
    else if (operation == 2) {
        req.removeSession('login').then(() => {
            const [m, port, host] = [{ operation: 'useroffline', socketid, id: login.id }, udpport, udphost];
            req.udpSend(m, port, host).then(() => res.json({ success: true })).catch(() => {
                req.logErr(`退出失败`);
                res.json({ success: false, text: 3 });
            });
        }).catch(() => res.json({ success: false }));
    }
    else {
        res.status(404);
        res.json({ err: '您访问的页面不存在' });
    }
}