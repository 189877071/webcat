const { tables: { loginTable, recordTable }, uploadFilePC } = require('../../../public/config');

const { writeFile, mkdir, exists } = require('fs');

module.exports = function (req, res) {
    const login = req.getSession('login');

    if (!login || !login.id) {
        res.json({ err: '您访问的页面不存在' });
        return;
    }

    const { content, receiveid, operation, socket } = req.body;

    if (!content || !receiveid) {
        res.json({ success: false, text: 0 });
        return;
    }

    let oContent = content;

    if (!operation || operation == 'common') {
        oContent = content.replace(/\\/g, '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        receiveUser().then(insertRecord).then(send);
    }
    else if (operation == 'videoCommunication' || operation == 'videoCommunicationCallback' || operation == 'audioCommunication' || operation == 'audioCommunicationCallback') {
        receiveUser().then(send);
    }
    else if (operation == 'childVideoCallback') {
        if (!socket) {
            res.json({ success: false, text: 3 });
            return;
        }
        try {
            sendSocket(JSON.parse(socket));
        }
        catch (e) {
            res.json({ success: false, text: 4 });
            return;
        }
    }
    else if (operation == 'image') {
        baocunImg(content);
    }


    // 判断接收消息的用户是否在线
    function receiveUser() {
        return new Promise(reslove => {
            req.dbSelect(loginTable, { where: `userid=${receiveid}`, orderBy: 'otime desc' }).then(data => {
                // data[0] 存在表示用户在线 不存在则离线
                reslove(data[0]);
            }).catch(() => {
                req.logErr(`查询 ${loginTable} 表出错：目的是 判断接收消息的用户是否在线`);
                res.json({ success: false, text: 1 });
            })
        })
    }

    // 把消息写入数据表中
    function insertRecord(data) {
        return new Promise(reslove => {
            const sql = {
                sendid: login.id,
                receiveid: receiveid,
                content: oContent,
                state: data ? 1 : 0,
                otime: Date.now()
            }
            req.dbInsert(recordTable, sql).then(() => reslove(data)).catch(() => {
                req.logErr(`添加 ${loginTable} 表出错：目的是 把消息写入数据表中`);
                res.json({ success: false, text: 2 });
            })
        })
    }

    // 发送给好友
    function send(data) {
        if (!data) {
            res.json({ success: true });
            return;
        }

        const [m, port, host] = [
            {
                operation: operation ? operation : 'common',
                content: oContent,
                id: data.socketid,
                sendid: login.id
            },
            data.port,
            data.host
        ];

        req.udpSend(m, port, host).then(() => res.json({ success: true })).catch(() => {
            req.logErr(`消息发送失败`);
            res.json({ success: false, text: 3 });
        })
    }

    // 发送到指定的socket id上
    function sendSocket(data) {
        // { udphost: udp ip地址, udpport: udp 端口, socketid: socket id }
        const [m, port, host] = [
            {
                operation: operation ? operation : 'childVideoCallback',
                content: oContent,
                id: data.socketid
            },
            data.udpport,
            data.udphost
        ];

        req.udpSend(m, port, host).then(() => res.json({ success: true })).catch(() => {
            req.logErr(`消息发送失败`);
            res.json({ success: false, text: 5 });
        });
    }

    // 保存图片
    function baocunImg(data) {
        const date = new Date();
        const dateDir = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
        const path = `${uploadFilePC}/${dateDir}`;
        const dataName = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}${Math.ceil(Math.random() * 1000 + 1000)}.png`;

        const existsCallback = () => {
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

        const writeFileCallback = () => {
            return new Promise(reslove => {
                // 写入文件
                let odata = data.replace('data:image/png;base64,', '');

                writeFile(path + '/' + dataName, odata, { encoding: 'base64' }, err => {
                    if (err) {
                        // 写入文件失败
                        res.json({ success: false, text: 8 });
                        return;
                    }
                    oContent = `{{自定义图片/image/upload/${dateDir}/${dataName}}}`;
                    reslove();
                });
            })
        }

        const imgSend = data => {
            if (!data) {
                res.json({ success: true, content: oContent });
                return;
            }

            const [m, port, host] = [
                {
                    operation: 'common',
                    content: oContent,
                    id: data.socketid,
                    sendid: login.id
                },
                data.port,
                data.host
            ];

            req.udpSend(m, port, host).then(() => res.json({ success: true, content: oContent })).catch(() => {
                req.logErr(`消息发送失败`);
                res.json({ success: false, text: 3 });
            })
        }

        // 判断目录存不存在如果不存在就创建目录
        // 把图片保存到目录
        // 查看用户在不在线
        // 把图片地址保存到数据库
        // 发送给好友
        existsCallback().then(writeFileCallback).then(receiveUser).then(insertRecord).then(imgSend);
    }

}