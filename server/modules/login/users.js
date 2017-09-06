const { tables: { userTable, loginTable } } = require('../../../public/config');

module.exports = function (req, res) {

    req.dbSelect(loginTable, {
        cols: 'userid'
    }).then(login => {
        const config = {
            cols: 'id,username',
            orderBy: 'logindate desc'
        }

        if (login.length) {
            let arr = [];

            for (let i = 0; i < login.length; i++) {
                arr.push(login[i].userid);
            }
            let idStr = arr.toString();
            config.where = `username like '18987708%' and id not in(${idStr})`;
        }
        else {
            config.where = `username like '18987708%'`;
        }

        req.dbSelect(userTable, config).then((users) => {
            res.json({ users });
        }).catch(() => {
            res.json({ users: [] });
        });

    }).catch(() => {
        res.json({ users: [] });
    });
}