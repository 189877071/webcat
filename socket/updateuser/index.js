const app = require('express')();

const server = require('http').Server(app);

const io = require('socket.io')(server);

const http = require('http');

const { writeFile } = require('fs');

const md5 = require('md5');

const { insert } = require('../../public/db');

server.listen(4005);

app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

let num = 0;

let now = Date.now();

io.on('connection', (socket) => {

    let src = '';

    let arr = [];

    socket.on('base64', writeImg);

    socket.on('loadok', function (data) {
        arr = data;
        getImg();
    })

    function getImg() {

        if (num >= arr.length) return;

        let url = '';

        if (num < 60) {
            url = `http://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E5%A4%B4%E5%83%8F+%E5%8D%A1%E9%80%9A%E5%8A%A8%E6%BC%AB+%E6%B5%B7%E8%B4%BC%E7%8E%8B&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=&z=&ic=&word=%E5%A4%B4%E5%83%8F+%E5%8D%A1%E9%80%9A%E5%8A%A8%E6%BC%AB+%E6%B5%B7%E8%B4%BC%E7%8E%8B&s=&se=&tab=&width=200&height=200&face=&istype=&qc=&nc=&fr=&cg=head&pn=${num}&rn=1&gsm=1e&1501174412288=`
        }
        else if (num < 120) {
            let on = num - 60;
            url = `http://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E5%A4%B4%E5%83%8F+%E5%8D%A1%E9%80%9A%E5%8A%A8%E6%BC%AB+%E5%8D%A1%E5%8D%A1%E8%A5%BF&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=&z=&ic=&word=%E5%A4%B4%E5%83%8F+%E5%8D%A1%E9%80%9A%E5%8A%A8%E6%BC%AB+%E5%8D%A1%E5%8D%A1%E8%A5%BF&s=&se=&tab=&width=200&height=200&face=&istype=&qc=&nc=&fr=&cg=head&pn=${on}&rn=1&gsm=3c&${now}=`;
        }
        else {
            let on = num - 120;
            url = `http://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E5%A4%B4%E5%83%8F+%E4%B8%8D%E5%90%8C%E9%A3%8E%E6%A0%BC+%E5%94%AF%E7%BE%8E&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=&z=&ic=&word=%E5%A4%B4%E5%83%8F+%E4%B8%8D%E5%90%8C%E9%A3%8E%E6%A0%BC+%E5%94%AF%E7%BE%8E&s=&se=&tab=&width=200&height=200&face=&istype=&qc=&nc=&fr=&cg=head&pn=${on}&rn=1&gsm=1e&1501174601689=`;
        }


        http.get(url, function (r) {

            let data = "";

            r.setEncoding("binary");

            r.on("data", chunk => data += chunk);

            r.on('end', function () {
                try {
                    src = JSON.parse(data).data[0].middleURL;

                    socket.emit('init', { src });
                    console.log('数据解析ok, url=' + src);
                }
                catch (e) {
                    console.log('数据解析失败');
                    num++;
                    getImg();
                }
            });
        }).on('error', function (e) {
            console.log('err');
            num++;
            getImg();
        });
    }

    function writeImg(d) {

        if (!d) {
            num++;
            console.log('图片加载失败', src);
            getImg();
            return;
        }

        let data = d.replace('data:image/png;base64,', '');

        const srcArr = src.split('.');

        const headphoto = `/image/headphoto/ht.${num}.${srcArr[srcArr.length - 1]}`;

        writeFile(`../../pc/public${headphoto}`, data, { encoding: 'base64' }, (err) => {
            if (err) {
                console.log(src + '写入失败');
                num++;
                console.log(num);
                getImg();
                return;
            }

            console.log(src + '文件写入成功');

            let time = Date.now();

            let data = {
                username: `18987708${num}`,
                password: md5('123456'),
                headphoto,
                resdate: time,
                email: `18987708${num}@qq.com`,
                synopsis: '',
                logindate: time,
                loginnum: 1,
                name: arr[num]
            }

            insert('cat_user', data).then((data) => {
                console.log('添加成功');
                num++;
                console.log(num);
                getImg();
            }).catch(() => {
                console.log('添加失败');
                num++;
                console.log(num);
                getImg();
            });

        })
    }

});
