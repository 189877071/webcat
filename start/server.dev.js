const webpack = require('webpack');

const webpackDevMiddleware = require('webpack-dev-middleware');

const webpackHotMiddleware = require('webpack-hot-middleware');

const { upwardDir } = require('../public/fn');

const { uploadFilePC: uploadDir } = require('../public/config');

const express = require('express');

const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');

const multipart = require("connect-multiparty");

const config = require('./webpack.conf.dev');

const server = require('../server');

const session = require('../public/session');

const app = express();

const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));

app.use(webpackHotMiddleware(compiler));

app.use(express.static(`${upwardDir(__dirname)}/src/public`)); // 设置静态目录

app.use(cookieParser());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(multipart({ uploadDir }));

app.use(session);

app.use('/server/*', server);

app.get('*', (req, res) => res.sendFile(`${upwardDir(__dirname)}/src/index.html`));

module.exports = port => app.listen(port);