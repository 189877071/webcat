
// 获取上一级目录
exports.upwardDir = dir => {
    dir = dir.replace(/\\/g, '/').split('/');
    dir.pop();
    return dir.join('/');
}

exports.getVerify = (num, type) => {
    const str = type ? '1234567890' : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ0123456789';
    let verify = '';
    for (var i = 0; i < num; i++) {
        verify += str[Math.floor(Math.random() * str.length)];
    }
    return verify;
}

// 判断是不是模块
exports.isModule = function (obj, str) {
    if (!obj) {
        return false;
    }
    else if (obj[str]) {
        return obj[str];
    }
    else if (obj['index']) {
        return obj['index']
    }
    else {
        return false;
    }
}