const router = require('./router');

const { isModule } = require('../public/fn');

const { send } = require('../public/udp.server');

module.exports = (req, res, next) => {
    req.udpSend = send;

    const path = req.params[0].split('/');

    let module = router[path[0]];

    for (let i = 1; i < path.length; i++) {
        module = isModule(module, path[i]);
        if (!module) break;
    }

    if (module && typeof module !== 'function') {
        module = isModule(module, 'index');
    }

    if (module) {
        module(req, res, next);
        return;
    }

    res.status(404);

    res.json({ err: '您访问的页面不存在' });
}