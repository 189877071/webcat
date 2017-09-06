
const { tables: { userTable }, uploadFilePC } = require('../../../public/config');

const md5 = require('md5');

const { writeFile, mkdir, exists } = require('fs');

module.exports = function (req, res) {
    const login = req.getSession('login');

    if (!login || !login.id) {
        res.json({ err: '您访问的页面不存在' });
        return;
    }

    const { email, age, name, synopsis, ext, password, verifyEmail, headphoto } = req.body;

    let data = { age, name, synopsis, ext }

    if (email) {
        const updateEmailVerify = req.getSession('updateEmailVerify');

        if (!updateEmailVerify || !updateEmailVerify.email || !updateEmailVerify.verify) {
            // 修改邮箱时 没有进行邮箱验证
            res.json({ success: false, text: 1 });
            return;
        }

        if (verifyEmail != updateEmailVerify.verify) {
            // 邮箱验证码不正确
            res.json({ success: false, text: 2 });
            return;
        }

        data.email = updateEmailVerify.email;
    }

    // if (password) {
    //     if (password.length < 6 || password.length > 16) {
    //         // 密码长度不正确
    //         res.json({ success: false, text: 3 });
    //         return;
    //     }

    //     data.password = md5(password);
    // }

    if (headphoto) {
        baocunImg(headphoto);
    }
    else {
        update();
    }

    function update() {
        req.dbUpdate(userTable, `id=${login.id}`, data).then(data => {
            res.json({ success: true });
        }).catch(err => {
            res.json({ success: false, text: 4 });
            req.logErr('修改资料出错');
        });
    }

    function baocunImg(file) {
        const date = new Date();
        const dateDir = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
        const path = `${uploadFilePC}/${dateDir}`;
        const dataName = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}${Math.ceil(Math.random() * 1000 + 1000)}.png`;

        function existsCallback() {
            return new Promise(reslove => {
                exists(path, onoff => {
                    if (!onoff) {
                        mkdir(path, err => {
                            if (err) {
                                // 创建目录失败
                                res.json({ success: false, text: 7 });
                                return;
                            }
                            reslove();
                        });
                        return;
                    }
                    reslove();
                });
            })
        }

        function writeFileCallback() {
            return new Promise(reslove => {
                // 写入文件
                let odata = file.replace('data:image/png;base64,', '');

                writeFile(path + '/' + dataName, odata, { encoding: 'base64' }, err => {
                    if (err) {
                        // 写入文件失败
                        res.json({ success: false, text: 8 });
                        return;
                    }
                    data.headphoto = `/image/upload/${dateDir}/${dataName}`;
                    reslove();
                });
            })
        }

        existsCallback().then(writeFileCallback).then(update);
    }
}