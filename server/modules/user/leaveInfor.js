const { tables } = require('../../../config');

module.exports = function (req, res) {
    const [login] = [
        req.getSession('login')
    ];

    if (!login || !login.id) {
        res.json({ err: '您访问的页面不存在' });
        return;
    }

    req.dbSelect(tables.recordTable, {
        where: `sendid=${login.id} and state=0)`,
        orderBy: 'otime asc',
        limit: 300
    }).then(data => {
        res.json({ data, success: true });
    }).catch(() => {
        res.json({ success: false, text: 1 });
        req.logErr(`查询 ${tables.recordTable} 表出错：目的是 查询聊天记录`);
    });
}