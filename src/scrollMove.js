class ScrollMove {
    constructor(box, list, scrollBox, scroll, moveY, config) {
        this.box = $(box);
        this.list = $(list);
        this.scrollBox = $(scrollBox);
        this.scroll = $(scroll);
        this.moveY = $(moveY);
        this.scrollBoxTime = null;
        this.autoMoveTime = null;
        this.num = 20;

        this.moveYH = (config && config.moveYH) ? config.moveYH : this.moveY.height();

        this.setListH = (config && config.setListH) ? config.setListH : false;

        this.scrollBoxColor = (config && config.scrollBoxColor) ? config.scrollBoxColor : 'rgba(0,0,0,.3)';

        this.loadImg = config && config.loadImg ? config.loadImg : null;

        this.boxMinMoveH = this.box.height();

        this.scrollWindowMove = this.scrollWindowMove.bind(this);
        this.scrollWindowUp = this.scrollWindowUp.bind(this);
        this.moveYWindowMove = this.moveYWindowMove.bind(this);
        this.moveYWindowUp = this.moveYWindowUp.bind(this);
    }

    init() {
        this.initElement();
        this.scrollEvent();
        this.listYEvent();
        this.moveEvent();
    }

    initElement() {
        this.boxH = this.box.height();

        this.listH = this.list.height();

        this.listT = this.list.offset().top;

        this.b = this.boxH / this.listH;

        if (this.b > 1) this.b = 1;

        this.scrollH = this.boxH * this.b;

        if (this.scrollH < 10) this.scrollH = 10;

        this.scrollMaxT = this.boxH - this.scrollH;

        if (this.scrollMaxT < 0) this.scrollMaxT = 0;

        this.listMinT = this.boxH - this.listH;

        if (this.listMinT > 0) this.listMinT = 0;

        this.scrollBox.height(this.boxH);

        this.scroll.height(this.scrollH);

        if (this.scrollH >= this.boxH) {
            this.scrollBox.css('display', 'none');
        }
        else {
            this.scrollBox.css('display', 'block');
        }

    }

    scrollEvent() {
        this.scrollBox.on('mouseover', () => {
            clearTimeout(this.scrollBoxTime);

            this.scrollBox.css('background', this.scrollBoxColor);
        });

        this.scrollBox.on('mouseout', this.scrollBoxOut.bind(this));

        this.scroll.on('mousedown', (ev) => {
            ev.preventDefault();

            this.scrollDownY = ev.pageY - this.scroll.position().top;

            $(window).on('mousemove', this.scrollWindowMove).on('mouseup', this.scrollWindowUp);
        });
    }

    scrollBoxOut() {
        const _this = this;
        this.scrollBoxTime = setTimeout(() => {
            _this.scrollBox.css('background', 'rgba(0,0,0,0)');
        }, 300);
    }

    scrollWindowUp() {
        this.scrollBoxOut();
        $(window).off('mousemove', this.scrollWindowMove).off('mouseup', this.scrollWindowUp);
    }

    scrollWindowMove(ev) {
        clearTimeout(this.scrollBoxTime);
        let t = ev.pageY - this.scrollDownY;
        this.setScrollTop(t);
        this.setListTop(-t / this.b);
    }

    setListTop(num) {
        if (num > 0) num = 0;
        if (num < this.listMinT) num = this.listMinT;

        this.list.css('top', num);
    }

    setScrollTop(num) {
        if (num < 0) num = 0;
        if (num > this.scrollMaxT) num = this.scrollMaxT;
        this.scroll.css('top', num);
    }

    listYEvent() {
        let time = Date.now();
        this.box.on('wheel', (ev) => {
            clearInterval(this.autoMoveTime);
            let aTime = Date.now();
            const fx = ev.originalEvent.deltaY > 0 ? 1 : -1;
            let num = this.num * fx;
            let t = this.list.position().top - num;
            this.setListTop(t);
            this.setScrollTop(-t * this.b);
            this.autoMove((aTime - time) * fx);
            time = aTime;
            this.loadImg && this.loadImg(this.boxMinMoveH - t + 600);
        }).on('click', () => {
            clearInterval(this.autoMoveTime);
        }).on('mouseover', () => {
            this.initElement();
        })
    }

    autoMove(diff) {
        let num = Math.floor(10000 / diff);
        if (num > 800) num = 800;
        if (num < -800) num = -800;
        this.autoMoveTime = setInterval(() => {
            let aNum = Math.floor(num / 1.8);
            if (aNum > 0 && aNum > this.num) aNum = this.num;
            if (aNum < 0 && aNum < -this.num) aNum = -this.num;
            num = num - aNum;

            if (Math.abs(aNum) < 1) {
                clearInterval(this.autoMoveTime);
            }

            let t = this.list.position().top - aNum;

            this.setListTop(t);
            this.setScrollTop(-t * this.b);

        }, 18);
    }

    moveEvent() {
        this.moveY.on('mousedown', (ev) => {
            ev.preventDefault();

            this.moveYDownPageY = ev.pageY;
            this.activeBoxH = this.boxH;

            $(window).on('mousemove', this.moveYWindowMove).on('mouseup', this.moveYWindowUp);
        })
    }

    moveYWindowUp() {
        $(window).off('mousemove', this.moveYWindowMove).off('mouseup', this.moveYWindowUp);
    }

    moveYWindowMove(ev) {
        let Y = ev.pageY - this.moveYDownPageY;
        this.setBoxH(this.activeBoxH + Y);
    }

    setBoxH(num) {
        let maxH = $(window).height() - this.box.offset().top - this.moveYH;

        if (num > maxH) num = maxH;

        if (num < this.boxMinMoveH) num = this.boxMinMoveH;

        this.box.height(num);

        // 到这里添加方法
        if (this.setListH) {
            this.setListH(num);
        }

        this.initElement();

        let listTop = this.list.position().top;

        if (listTop < this.listMinT) {
            listTop = this.listMinT;
            this.list.css('top', this.listMinT);
        }

        this.setScrollTop(-listTop * this.b);
    }
}

export default ScrollMove;