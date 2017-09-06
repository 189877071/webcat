const http = require('http');

const { getVerify } = require('../../../public/fn');

const { imgverifyurl } = require('../../../public/config');

module.exports = function (req, res, next) {
    
    const verify = getVerify(4, true);

    let { q } = req.query;

    // loginverify 登录的验证码 / regverify  注册的验证码
    q = q === 'regverify' ? 'regverify' : 'loginverify';
    
    http.get(`${imgverifyurl}?val=${verify}`, function (r) {

        let imgData = "";
   
        r.setEncoding("binary");

        r.on("data", chunk => imgData += chunk);
        
        r.on('end', function () {
            req.setSession(q, verify).then(() => {
                res.type("png");
                res.write(imgData, "binary");
                res.send();
            }).catch(() => {
                res.status('404');
                res.send('');
            });
        });

    }).on('error', function (e) {
        res.status('404');
        res.send('');
    });
}