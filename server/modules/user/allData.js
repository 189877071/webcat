
const { tables: { userTable, loginTable, recordTable } } = require('../../../public/config');

module.exports = function (req, res, next) {

    const login = req.getSession('login');

    if (!login || !login.id) {
        res.status(404);
        res.json({ err: '你访问的页面不存在' });
        return;
    }

    selectUser().then(selectLogin).then(leaveInfor);

    function selectUser() {
        return new Promise(reslove => {
            const config = {
                cols: 'id,username,headphoto,email,synopsis,ext,age,logindate,name',
                orderBy: 'logindate desc',
                where: `id != ${login.id}`
            }
            req.dbSelect(userTable, config).then((users) => {
                reslove(users);
            }).catch(() => {
                req.logErr('获取所有用户失败');
                res.json({ users: [] });
            });
        })
    }

    function selectLogin(users) {
        return new Promise(reslove => {
            req.dbSelect(loginTable).then(login => {
                reslove({ users, login })
            }).catch(() => {
                req.logErr('获取登录信息失败');
                res.json({ users: [] });
            })
        })
    }
    // 获取离线信息
    function leaveInfor(oData) {
        req.dbSelect(recordTable, {
            where: `receiveid=${login.id} and state=0`,
            cols: 'sendid'
        }).then(data => {
            res.json({ users: oData.users, login: oData.login, leaveInfor: data });
        }).catch(() => {
            res.json({ users: oData.users, login: oData.login, leaveInfor: [] });
            req.logErr(`查询 ${recordTable} 表出错：目的是 查询留言信息`);
        });
    }

}