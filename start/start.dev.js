opn = require('opn');

const { fork, exec } = require('child_process');

const server = require('./server.dev');

const { dev: { httpPort, socket, hostName } } = require('../public/config');

const { upwardDir } = require('../public/fn');

server(httpPort);

const io = fork(`${upwardDir(__dirname)}/socket`);

io.send(socket);

opn(hostName);