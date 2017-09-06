const { tables: { userTable } } = require('../../../public/config');

const { getVerify } = require('../../../public/fn');

const emailSubmit = require('../../../public/email');

const repEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

module.exports = function (req, res) {

    const login = req.getSession('login');

    if (!login || !login.id) {
        res.json({ err: '您访问的页面不存在' });
        return;
    }

    const { email } = req.body;

    if (!email || !repEmail.test(email)) {
        res.json({ success: false, text: 1 });
        return;
    }

    const verify = getVerify(6, true);

    console.log(verify, email);

    setSession().then(select).then(sendVerify);

    function setSession() {
        return new Promise(reslove => {
            req.setSession('updateEmailVerify', { verify, email }).then(() => {
                reslove();
            }).catch(err => {
                req.logErr('验证码储存进session失败');
                res.json({ success: false, text: 2 });
            });
        })
    }

    function select() {
        return new Promise(reslove => {
            req.dbSelect(userTable, { where: `email='${email}'` }).then(data => {
                if (data[0]) {
                    res.json({ success: false, text: 3 });
                    return;
                }
                reslove();
            }).catch(err => {
                req.logErr('查询邮箱是否存在出错');
                res.json({ success: false, text: 4 });
            })
        });
    }

    function sendVerify() {
        emailSubmit(email, '聊天系统', '修改邮箱地址', `验证码：${verify}`).then(() => {
            res.json({ success: true });
        }).catch(err => {
            req.logErr('邮件发送失败');
            res.json({ success: false, text: 5 });
        })
    }
}