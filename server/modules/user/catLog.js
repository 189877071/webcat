
const { tables: { recordTable } } = require('../../../public/config');

module.exports = function (req, res) {
    const [login, id] = [
        req.getSession('login'),
        req.body.id
    ];

    if (!login || !login.id) {
        res.json({ err: '您访问的页面不存在' });
        return;
    }

    if (!id) {
        res.json({ success: false, text: 0 });
        return;
    }

    function updateInforState() {
        return new Promise(reslove => {
            req.dbUpdate(recordTable, `receiveid=${login.id} and sendid=${id}`, { state: 1 })
                .then(reslove)
                .catch(() => {
                    req.logErr(`修改 ${recordTable} 表出错：目的是 改变聊天记录状态`);
                    reslove();
                })
        })
    }

    function selectInfo() {
        req.dbSelect(recordTable, {
            where: `sendid in(${id},${login.id}) and receiveid in(${id},${login.id})`,
            orderBy: 'otime asc',
            limit: 300
        }).then(data => {
            res.json({ data, success: true });
        }).catch(() => {
            res.json({ success: false, text: 1 });
            req.logErr(`查询 ${recordTable} 表出错：目的是 查询聊天记录`);
        });
    }

    updateInforState().then(selectInfo);
}