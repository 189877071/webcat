const dgram = require('dgram');

const { tables, socket } = require('./config');

const { insert, select, update, deleted, sql } = require('./db');

const log = require('./logErr');

const { loginTable } = tables;

const client = dgram.createSocket('udp4');

function send(m, port, host) {

    return new Promise((reslove, reject) => {

        const message = new Buffer((typeof m == 'object') ? JSON.stringify(m) : m);

        client.send(message, 0, message.length, Number(port), host, (err, bytes) => {
            if (err) {
                reject();
            }
            else {
                reslove();
            }
        });
    })
}

class SendExit {
    // 获取下线用户的登录表数据
    getLoginData(socketid) {
        select(loginTable, { where: `socketid='${socketid}'` }).then(data => {
            if (!data.length) return;
            this.userid = data[0].userid;
            this.id = data[0].id;
            this.removeData();
        }).catch(() => {
            log({ err: `查询${loginTable}表单失败` });
        })
    }
    // 删除下线用户的登录表数据
    removeData() {
        deleted(loginTable, `id=${this.id}`).then(() => {
            this.all()
        }).catch(() => {
            log({ err: `删除${loginTable}表单失败` });
        })
    }
    // 获取所有登录用户数据
    all() {
        select(loginTable, { cols: `socketid,host,port` }).then(data => {
            if (!data.length) return;
            data.forEach(item => send({ operation: 'useroffline', id: item.socketid, userid: this.userid }, item.port, item.host))
        })
    }
}

client.on('message', function (msg, rinfo) {
    msg = JSON.parse(msg);

    if (msg.operation == 'userexit') {
        let oSendExit = new SendExit();
        oSendExit.getLoginData(msg.socketid);
    }
});

exports.send = send;
