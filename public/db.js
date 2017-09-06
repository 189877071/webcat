const mysql = require('mysql');

const { db, tables } = require('./config');

const { host, user, database, password } = db;

const { sessionTable, userTable, autologinTable, loginTable } = tables;

function mysqlConnection(sql, resolve, reject) {

    const connection = mysql.createConnection(
        {
            host,
            user,
            password,
            database
        }
    );

    connection.connect();

    connection.query(sql, function (error, results, fields) {
        if (error) {
            reject && reject(error);
        }
        else {
            resolve && resolve(results);
        }
    });

    connection.end();
}

// 插入数据
function insert(table, data) {
    return new Promise(function (resolve, reject) {
        if (!table || !data) {
            reject();
            return;
        }

        let col = '';

        let val = '';

        if (Array.isArray(data)) {

            let aKey = [];

            for (let key in data[0]) {
                aKey.push(key);
            }

            for (let i = 0; i < data.length; i++) {

                let cov = '';

                if (!data[i] instanceof Object) {
                    reject();
                    return;
                }

                for (let j = 0; j < aKey.length; j++) {
                    let ov = data[i][aKey[j]];
                    if (!ov)
                        ov = 'null';
                    else if (typeof ov === 'string')
                        ov = `'${ov}'`;
                    else if (typeof ov !== 'number') {
                        reject();
                        return;
                    }

                    cov += ov + ',';
                }

                val += '(' + cov.slice(0, cov.length - 1) + '),'
            }

            col = '(' + aKey.join(',') + ')';

            val = val.slice(0, val.length - 1);
        }
        else if (data instanceof Object) {
            let aKey = [];
            for (let key in data) {
                let v = data[key];
                if (typeof v === 'string') v = `'${v}'`;
                val += v + ','
                aKey.push(key);
            }
            col = '(' + aKey.join(',') + ')';
            val = '(' + val.slice(0, val.length - 1) + ')';
        }
        else {
            reject();
            return;
        }
        const sql = `insert into ${table} ${col} values ${val}`;
        mysqlConnection(sql, resolve, reject);
    });
}

// 查询数据
function select(table, config = {}) {
    // where 条件
    // order by 排序
    // limit  输出限制
    // cols   要输出的字段
    return new Promise(function (resolve, reject) {
        if (!table) {
            reject();
            return;
        }
        const cols = config.cols ? config.cols : '*';
        const where = config.where ? 'where ' + config.where : '';
        const orderBy = config.orderBy ? 'order by ' + config.orderBy : '';
        const limit = config.limit ? 'limit ' + config.limit : '';
        const sql = `select ${cols} from ${table} ${where} ${orderBy} ${limit}`;

        mysqlConnection(sql, resolve, reject);
    })
}

// 修改数据
function update(table, where, newData) {
    return new Promise(function (resolve, reject) {
        if (!table || !where || !newData || !newData instanceof Object) {
            reject();
            return;
        }

        var arr = [];

        for (let key in newData) {
            let ov = (typeof newData[key] === 'string') ? `'${newData[key]}'` : newData[key];
            arr.push(key + '=' + ov);
        }
        const sql = `update ${table} set ${arr.join(',')} where ${where}`;

        mysqlConnection(sql, resolve, reject);
    })
}

// 删除数据
function deleted(table, where) {
    return new Promise(function (resolve, reject) {

        if (!table || !where) {
            reject();
            return;
        }

        const sql = `delete from ${table} where ${where}`;

        mysqlConnection(sql, resolve, reject);
    });
}

// 执行sql语句
function sql() {
    return new Promise(function (resolve, reject) {
        if (!sql) {
            reject();
            return;
        }
        mysqlConnection(sql, resolve, reject);
    })
}

module.exports = {insert, select, update, deleted, sql}

// mysqlConnection(`truncate table ${sessionTable}`);
// mysqlConnection(`truncate table ${autologinTable}`);
// mysqlConnection(`truncate table ${loginTable}`);
// mysqlConnection(`truncate table ${userTable}`);