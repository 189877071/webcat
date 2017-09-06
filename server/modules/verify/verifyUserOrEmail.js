const { tables: { userTable } } = require('../../../public/config');


// 验证用户名或者邮箱是否存在
module.exports = function (req, res, next) {

    const { username, email } = req.body;

    if (username) {
        // 验证用户名是否存在
        verifyUsername(username, req, res);
    }
    else if (email) {
        // 验证邮箱是否存在
        verifyEmail(email, req, res)
    }
    else {
        res.status(404);
        res.json({ err: '您访问的页面不存在' });
    }
}

function verifyUsername(username, req, res) {
    // text = 1 格式不正确 2 用户名已经纯在 3 数据查询失败
    // success= true 用户名不存在可以插入
    if (typeof username !== 'string' || username.length < 6 || username.length > 16 || /\W/.test(username)) {
        res.json({ success: false, text: 1 });
        return;
    }

    req.dbSelect(userTable, { where: `username='${username}'` }).then((data) => {
        if (data[0]) {
            res.json({ success: false, text: 2 });
        }
        else {
            res.json({ success: true });
        }
    }).catch((err) => {
        res.json({ success: false, text: 3 });
    })
}

function verifyEmail(email, req, res) {
    // text: 1 格式不正确 2 邮箱已经存在 3 邮箱查询出错
    // success: true 邮箱不存在可以插入
    const repEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (typeof email !== 'string' || !repEmail.test(email)) {
        res.json({ success: false, text: 1 });
        return;
    }

    req.dbSelect(userTable, { where: `email='${email}'` }).then((data) => {
        if (data[0]) {
            res.json({ success: false, text: 2 })
        }
        else {
            res.json({ success: true });
        }
    }).catch((err) => {
        res.json({ success: false, text: 3 });
    })
}


