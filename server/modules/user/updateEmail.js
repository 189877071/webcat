
const { tables } = require('../../../config');

module.exports = function (req, res) {
    const login = req.getSession('login');

    if (!login || !login.id) {
        res.json({ err: '您访问的页面不存在' });
        return;
    }

    const { email } = req.body;

    req.dbSelect(tables.userTable, `email='${email}'`).then(data => {
        if (data[0]) {
            res.json({ success: false, text: 1 });
            return;
        }

        res.dbUpdate(tables.userTable, `id=${login.id}`, { email }).then(data => {
            res.json({ success: true });
        }).catch(err => {
            res.json({ success: false, text: 2 });
            req.logErr('修改邮箱失败');
        })

    })
}