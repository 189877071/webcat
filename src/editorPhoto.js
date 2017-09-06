class editopPhoto {
    constructor(src, obj, callback) {
        const {
            oImg, editBox, file, fangda, suoxiao, xuanzhuanR, xuanzhuanL, huanyuan,
            odown, odownBox
        } = obj;
        this.src = src;
        this.oImg = $(oImg);
        this.editBox = $(editBox);
        this.file = $(file);
        this.fangda = $(fangda);
        this.suoxiao = $(suoxiao);
        this.xuanzhuanR = $(xuanzhuanR);
        this.xuanzhuanL = $(xuanzhuanL);
        this.huanyuan = $(huanyuan);
        this.odown = $(odown);
        this.odownBox = $(odownBox);
        this.callback = callback;
        this.n = 50;
        // 旋转
        this.rotate = 0;
        this.odmaxw = $(editBox).width() - $(odownBox).width();
        this.odmaxh = $(editBox).height() - $(odownBox).height();
        this.left = $(odownBox).position().left;
        this.top = $(odownBox).position().top;
    }

    init() {
        this.boxW = this.editBox.width();

        this.boxH = this.editBox.height();

        this.Image = new Image();

        this.dpImg = new Image();

        this.reader = new FileReader();

        this.canvas = document.createElement('canvas');

        this.canvas.width = this.odownBox.width();

        this.canvas.height = this.odownBox.height();

        this.ctx = this.canvas.getContext('2d');

        this.reader.onload = e => this.readerLoad(e);

        this.Image.onload = () => this.imgLoad();

        this.dpImg.onload = () => this.Image.src = this.src;

        this.file.on('change', () => this.fileChange());

        this.fangda.on('click', () => this.fangdaImg());

        this.suoxiao.on('click', () => this.suoxiaoImg());

        this.xuanzhuanR.on('click', () => this.xuanzhuanRImg());

        this.xuanzhuanL.on('click', () => this.xuanzhuanLImg());

        this.huanyuan.on('click', () => this.huanyuanImg());

        this.odown.on('mousedown', e => this.odownDrag(e));

        this.dpImg.src = '/image/dipian.jpg';
    }

    odownDrag(e) {
        e.preventDefault();
        let [oX, oY, This, { left, top }, aL, aT] = [e.pageX, e.pageY, this, this.odownBox.position(), 0, 0];
        window.addEventListener('mousemove', windowMove, false);
        window.addEventListener('mouseup', windowUp, false);
        function windowMove(e) {
            [aL, aT] = [e.pageX - oX + left, e.pageY - oY + top];
            aL > This.odmaxw && (aL = This.odmaxw);
            aL < 0 && (aL = 0);
            aT > This.odmaxh && (aT = This.odmaxh);
            aT < 0 && (aT = 0);
            This.odownBox.css({
                left: aL,
                top: aT
            });
        }
        function windowUp() {
            window.removeEventListener('mousemove', windowMove, false);
            window.removeEventListener('mouseup', windowUp, false);
            This.left = aL;
            This.top = aT;
            This.jieping();
        }
    }

    imgLoad() {
        this.oImg.attr('src', this.Image.src);

        this.oImgW = this.Image.width;

        this.oImgH = this.Image.height;

        this.oImgB = this.oImgW / this.oImgH;

        this.setImgStyle();
    }

    setImgStyle() {
        this.imgL = (this.boxW - this.oImgW) / 2;
        this.imgT = (this.boxH - this.oImgH) / 2;
        this.oImg.css({
            left: this.imgL,
            top: this.imgT,
            width: this.oImgW,
            height: this.oImgH,
            transform: `rotate(${this.rotate}deg)`
        });
        this.jieping();
    }

    readerLoad(e) {
        this.Image.src = e.target.result;
    }

    fileChange() {
        this.reader.readAsDataURL(this.file.get(0).files[0]);
        this.rotate = 0;
    }

    fangdaImg() {
        this.oImgW += this.n;
        this.oImgH += this.n / this.oImgB;
        this.setImgStyle();
    }

    suoxiaoImg() {

        let [w, h] = [this.oImgW - this.n, this.oImgH - (this.n / this.oImgB)];

        if (w <= 100) return;

        this.oImgW = w;

        this.oImgH = h;

        this.setImgStyle();
    }

    xuanzhuanRImg() {
        this.rotate += 90;
        this.rotate == 360 && (this.rotate = 0);
        this.setImgStyle();
    }

    xuanzhuanLImg() {
        this.rotate -= 90;
        this.rotate == -360 && (this.rotate = 0);
        this.setImgStyle();
    }

    huanyuanImg() {
        this.oImgW = this.Image.width;

        this.oImgH = this.Image.height;

        this.rotate = 0;

        this.left = (this.editBox.width() - this.odownBox.width()) / 2;
        this.top = (this.editBox.height() - this.odownBox.height()) / 2;

        this.setImgStyle();

        this.odownBox.css({
            left: this.left,
            top: this.top
        });
    }

    jieping() {

        const b = this.oImgW / this.Image.width;

        const cw = this.canvas.width;
        const ch = this.canvas.height;

        // 这个是要剪切的宽度
        const width = cw / b;
        const height = ch / b;
        // 找到开始剪切的位置
        let x = this.left - this.imgL;
        let y = this.top - this.imgT;
        let cx = 0;
        let cy = 0;

        if (x < 0) {
            cx = -x;
            x = 0;
        }
        if (y < 0) {
            cy = -y;
            y = 0;
        }

        const tx = cw / 2;
        const ty = ch / 2;

        this.ctx.save();

        this.ctx.clearRect(0, 0, cw, ch);

        this.ctx.translate(tx, ty);

        this.ctx.rotate(this.rotate * Math.PI / 180);

        this.ctx.translate(-tx, -ty);

        this.ctx.drawImage(this.Image, x, y, width, height, cx, cy, cw, ch);

        const src1 = this.canvas.toDataURL('image/png');

        const imgData = this.ctx.getImageData(0, 0, cw, ch);

        this.ctx.clearRect(0, 0, cw, ch);

        this.ctx.drawImage(this.dpImg, 0, 0, 200, 200, cx, cy, cw, ch);

        const dpImgData = this.ctx.getImageData(0, 0, cw, ch);

        let newData = this.ctx.createImageData(cw, ch);

        for (let i = 0; i < imgData.data.length; i += 4) {
            newData.data[i] = (imgData.data[i] + dpImgData.data[i]) / 2;
            newData.data[i + 1] = (imgData.data[i + 1] + dpImgData.data[i + 1]) / 2;
            newData.data[i + 2] = (imgData.data[i + 2] + dpImgData.data[i + 2]) / 2;
            newData.data[i + 3] = imgData.data[i + 3];
        }

        this.ctx.clearRect(0, 0, cw, ch);

        this.ctx.putImageData(newData, 0, 0);

        const src2 = this.canvas.toDataURL('image/png');

        const v = 0.6;

        for (let i = 0; i < imgData.data.length; i += 4) {
            newData.data[i] = (imgData.data[i] - 127.5) * v + imgData.data[i] > 255 ? 255 : ((imgData.data[i] - 127.5) * v + imgData.data[i] < 0 ? 0 : (imgData.data[i] - 127.5) * v + imgData.data[i]);
            newData.data[i + 1] = (imgData.data[i + 1] - 127.5) * v + imgData.data[i + 1] > 255 ? 255 : ((imgData.data[i + 1] - 127.5) * v + imgData.data[i + 1] < 0 ? 0 : (imgData.data[i + 1] - 127.5) * v + imgData.data[i + 1]);
            newData.data[i + 2] = (imgData.data[i + 2] - 127.5) * v + imgData.data[i + 2] > 255 ? 255 : ((imgData.data[i + 2] - 127.5) * v + imgData.data[i + 2] < 0 ? 0 : (imgData.data[i + 2] - 127.5) * v + imgData.data[i + 2]);
            newData.data[i + 3] = imgData.data[i + 3];
        }
        this.ctx.clearRect(0, 0, cw, ch);

        this.ctx.putImageData(newData, 0, 0);

        const src3 = this.canvas.toDataURL('image/png');

        this.ctx.restore();

        this.callback && this.callback({ src1, src2, src3 });
    }

}

export default editopPhoto;