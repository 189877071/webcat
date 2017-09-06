const dgram = require('dgram');

const { tables, socket } = require('./config');

const { insert, select, update, deleted, sql } = require('./db');

const log = require('./logErr');

const { loginTable } = tables;

const client = dgram.createSocket('udp4');

exports.send = function (m, port, host) {

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

client.on('message', function (msg, rinfo) {
    const userexit = {
        userid: null,
        selectSocketId(data) {
            return new Promise(reslove => {
                select(loginTable, { where: `socketid='${data.socketid}'` }).then(data => {
                    if (!data.length) return;
                    userexit.userid = data[0].userid;
                    reslove(data[0].id);
                }).catch(() => {
                    log({ err: `查询${loginTable}表单失败，在udp.server.js文件中` });
                })
            })
        },
        deleteSocketId(id) {
            return new Promise(reslove => {
                deleted(loginTable, `id=${id}`).then(reslove).catch(() => {
                    log({ err: `删除${loginTable}表单失败，在udp.server.js文件中` });
                })
            })
        },
        sendExit() {
            const message = new Buffer(JSON.stringify({ operation: 'useroffline', id: userexit.userid }));
            socket.forEach(item => {
                client.send(message, 0, message.length, item.udpport, item.udphost);
            });
        }
    }

    try {
        const data = JSON.parse(msg);
        if (data.operation == 'userexit') {
            userexit.selectSocketId(data).then(userexit.deleteSocketId).then(userexit.sendExit);
        }
    }
    catch (e) { }
});
