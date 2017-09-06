const socket = require('socket.io');

const dgram = require('dgram');

const udpserver = dgram.createSocket('udp4');

let udprinfo = null;

process.on('message', (m) => {

    // console.log(io.sockets.sockets[socket.id] === socket);  在 io对象上获取 用户的socket
    const io = socket(m.port);

    io.on('connection', (socket) => {
       
        // 把挂载到socket上的信息 发送给用户
        socket.emit('initLoginData', { udphost: m.udphost, udpport: m.udpport, socketid: socket.id });

        socket.on('disconnect', () => {
            setTimeout(() => {
                if (!udprinfo) return;
                const buf = new Buffer(JSON.stringify({ operation: 'userexit', socketid: socket.id }));
                udpserver.send(buf, 0, buf.length, udprinfo.port, udprinfo.address); 
            }, 5000);
        })
    });

    // -----------------------------------------------------------

    const operation = {
        propose(data) {
            // 用户在其他地方登录，通知当前登录的浏览器退出
            io.sockets.sockets[data.id] && io.sockets.sockets[data.id].emit('propose', { success: true, browserkey: data.key ? data.key : '' });
        },
        useronline(data) {
            // 通知所有用户，有新的人上线了
            io.sockets.sockets[data.id] && io.sockets.sockets[data.id].emit('userOnLine', { id: data.userid });
        },
        useroffline(data) {
            // 下线通知
            io.sockets.sockets[data.id] && io.sockets.sockets[data.id].emit('userOffLine', { id: data.userid });
        },
        common(data) {
            io.sockets.sockets[data.id] && io.sockets.sockets[data.id].emit('shortMessage', { content: data.content, sendid: data.sendid });
        },
        videoCommunication(data) {
            io.sockets.sockets[data.id] && io.sockets.sockets[data.id].emit('videoCommunication', { sendid: data.sendid, content: data.content });
        },
        videoCommunicationCallback(data) {
            io.sockets.sockets[data.id] && io.sockets.sockets[data.id].emit('videoCommunicationCallback', { sendid: data.sendid, content: data.content });
        },
        childVideoCallback(data) {
            io.sockets.sockets[data.id] && io.sockets.sockets[data.id].emit('callback', {content: data.content});
        },
        audioCommunication(data) {
            io.sockets.sockets[data.id] && io.sockets.sockets[data.id].emit('audioCommunication', { sendid: data.sendid, content: data.content });
        },
        audioCommunicationCallback(data) {
            io.sockets.sockets[data.id] && io.sockets.sockets[data.id].emit('audioCommunicationCallback', { sendid: data.sendid, content: data.content });
        }
    }

    udpserver.on('message', (msg, rinfo) => {
        try {
            const megData = JSON.parse(msg.toString());
            operation[megData.operation] && operation[megData.operation](megData);
        }
        catch (e) {
            console.log('出错');
        }

        udprinfo = rinfo;
    });

    udpserver.bind(m.udpport, m.udphost);
})





