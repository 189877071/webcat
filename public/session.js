const { tables: { sessionTable } } = require('./config');

const { getVerify } = require('./fn');

const logErr = require('./logErr');

const {insert, select, update, deleted, sql} = require('./db');

module.exports = function (req, res, next) {
    // 挂载数据库操作
    req.dbInsert = insert;
    req.dbSelect = select;
    req.dbUpdate = update;
    req.dbDelete = deleted;
    req.dbSql = sql;

    // 错误日志
    req.logErr = err => logErr({
        ip: req.ip, date: new Date(),
        url: req.hostname + req.originalUrl,
        browser: req.headers[`user-agent`],
        err
    });

    let session = {};

    req.getSession = getSession;

    req.setSession = setSession;

    req.removeSession = removeSession;

    if (!req.cookies.session_id) {
        createSession();
    }
    else {
        inSession();
    }

    function setSession(key, val) {
        return new Promise((resolve, reject) => {
            if (!key || !val) {
                reject();
                return;
            }
            session[key] = val;
            req.dbUpdate(sessionTable, `session_id='${req.cookies.session_id}'`, { data: JSON.stringify(session), time: Date.now() })
                .then(() => {
                    resolve();
                })
                .catch(function (err) {
                    req.logErr('设置sesson失败');
                    reject();
                });
        })
    }

    function removeSession(key) {
        return new Promise((resolve, reject) => {

            delete session[key];

            req.dbUpdate(sessionTable, `session_id='${req.cookies.session_id}'`, { data: JSON.stringify(session), time: Date.now() })
                .then(() => {
                    resolve();
                })
                .catch(function (err) {
                    req.logErr('删除sesson失败');
                    reject();
                });
        })
    }

    function createSession() {

        const session_id = Date.now() + getVerify(5);

        // 给用户添加session
        req.dbInsert(sessionTable, {
            session_id,
            data: JSON.stringify({}),
            time: Date.now()
        }).then(function (data) {
            res.cookie('session_id', session_id);
            req.cookies.session_id = session_id;
            // 添加成功 往下执行
            next();
        }).catch(function (err) {
            // 添加不成功记录到日志往下执行
            req.logErr('添加 session_id 到数据库失败');
            next();
        });
    }

    function getSession(key) {
        if (!key) {
            return session;
        }
        return session[key];
    }

    function inSession() {
        // 有session时 先查询session
        req.dbSelect(sessionTable, { where: 'session_id="' + req.cookies.session_id + '"' }).then(function (data) {
            if (!data[0]) {
                // 如果session不存在 就新建session
                createSession();
                return;
            }
            // 查询成功后 把 字符串转换成session
            try {
                session = JSON.parse(data[0].data);
                next();
            }
            catch (e) {
                req.logErr('session字符串转JSON失败');
                createSession();
            }

        }).catch(function (err) {
            // 查询失败 写入日志往下执行
            req.logErr('查询session失败');
            createSession();
        });
    }
}
