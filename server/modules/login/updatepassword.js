const md5 = require('md5');

const { tables: { userTable } } = require('../../../public/config');

const { getVerify } = require('../../../public/fn');

const emailSubmit = require('../../../public/email');

module.exports = function (req, res, next) {
    const { step } = req.body;

    if (step == 1) {
        step1(req, res);
    }
    else if (step == 2) {
        step2(req, res);
    }
    else {
        res.status('404');
        res.json({ err: '访问的页面不存在' });
    }
}

function step1(req, res) {

    const { email } = req.body;

    if (!email) {
        res.json({ success: false, text: 1 });
        return;
    }

    req.dbSelect(userTable, { where: `email='${email}'` }).then((data) => {
        if (!data[0]) {
            res.json({ success: false, text: 2 });
            return;
        }

        const vstr = getVerify(6, true);

        emailSubmit(email, '修改密码', '验证码', `<h1>${vstr}</h1>`).then(() => {
            req.setSession('upemail', { verify: vstr, email }).then(() => {
                res.json({ success: true });
            }).catch(() => {
                res.json({ success: false, text: 3 });
            });
        }).catch(() => {
            req.logErr('邮箱验证码发送失败');
            res.json({ success: false, text: 5 });
        })

    }).catch(() => {
        req.logErr('查询邮箱失败');
        res.json({ success: false, text: 4 });
    })
}

function step2(req, res) {
    const { upemail } = req.getSession();
    const { password, verify } = req.body;

    if (!upemail) {
        res.json({ success: false, text: 0 });
        return;
    }

    if (!password || password.length < 6 || password.length > 20) {
        res.json({ success: false, text: 1 });
        return;
    }


    if (verify != upemail.verify) {
        res.json({ success: false, text: 2 });
        return;
    }

    req.dbUpdate(userTable, `email='${upemail.email}'`, { password: md5(password) }).then(() => {
        res.json({ success: true });
    }).catch(() => {
        req.logErr('修改密码失败');
        res.json({ success: false, text: 3 });
    })
}