const { upwardDir } = require('./fn');

module.exports = {
    dev: {
        httpPort: 3001,
        socket: { port: 4001, udphost: '127.0.0.1', udpport: 4101 },
        hostName: 'http://www.webcat.com'
    },
    master: {
        http: [
            { port: 3001 }
        ],
        socket: [
            { port: 4001, udphost: '127.0.0.1', udpport: 4101 }
        ]
    },
    db: {
        host: 'localhost',
        user: 'root',
        password: 'kuihua77071',
        database: 'webcat'
    },
    email: {
        host: "smtp.jsonhappy.com",
        port: 465,
        user: "postmaster@jsonhappy.com",
        pass: "Kuihua77071"
    },
    tables: {
        sessionTable: 'cat_session',
        userTable: 'cat_user',
        autologinTable: 'cat_autologin',
        loginTable: 'cat_socketloginuser',
        recordTable: 'cat_record'
    },
    logPath: `${upwardDir(__dirname)}/logs/`,
    logSize: 1048576,
    imgverifyurl: 'http://my.php.com/image.php',
    uploadFilePC: `${upwardDir(__dirname)}/src/public/image/upload`
}


