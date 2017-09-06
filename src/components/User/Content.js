import React, { Component } from 'react'

import { connect } from 'react-redux'

import { appCatWindow } from '../../store/app/action'

import ScrollMove from '../../scrollMove'

let orecordEnd = null;

class CatContent extends Component {
    render() {
        const { dispatch, id, appCat, appActive, h, index } = this.props;

        const oUser = this.getUser();

        const [miphoto, record, hehphoto, biaoqingshow, biaoqing] = [
            appActive.active.headphoto,
            oUser.record ? oUser.record : [],
            oUser.headphoto ? oUser.headphoto : '',
            oUser.biaoqingshow ? oUser.biaoqingshow : false,
            appCat.biaoqing
        ];

        return (
            <div>
                <div className="content-box" ref="box" style={h ? { height: h } : {}}>
                    <div className="list" ref="list">
                        <ul ref="listContent">
                            {this.contentList(record, miphoto, hehphoto, biaoqing)}
                        </ul>
                    </div>
                    <div className="scroll-box" ref="scrollBox">
                        <div className="scroll" ref="scroll"></div>
                    </div>
                </div>
                <div className="editor-box" ref="editorBox">

                    <div
                        className="editor-textarea"
                        contentEditable={true}
                        onKeyDown={ev => this.keyDownSend(ev)}
                        onKeyUp={ev => this.keyUpEditor(ev)}
                        ref="editorContent"
                        onPaste={this.editorPaste}
                    ></div>

                    <div className="bottom clearfix">
                        <div className="left">
                            <a href="javascript:;" title="选择表情" onClick={this.showbq}>
                                <i className="iconfont icon-xiaolian"></i>
                            </a>
                            <a href="javascript:;" title="向好友发送图片">
                                <i className="iconfont icon-tupian1"></i>
                                <input type="file" onChange={this.imgaeChange} accept="image/*" />
                            </a>
                            <a href="javascript:;" title="发起语音通话" onClick={this.audioCallShow}>
                                <i className="iconfont icon-vioce"></i>
                            </a>
                            <a href="javascript:;" title="发起视频通话" onClick={this.videoCallShow}>
                                <i className="iconfont icon-shexiangtou"></i>
                            </a>
                        </div>
                        <div className="right">
                            <a href="javascript:;" title="关闭窗口" onClick={this.close}>关闭</a>
                            <a href="javascript:;" title="按Ctrl+Enter键发消息"
                                onClick={() => this.send(this.refs.editorContent)}>发送</a>
                        </div>
                        <div className="biaoqing" style={{ display: biaoqingshow ? 'block' : 'none' }}>
                            <div className="xiangxiajiantou"></div>
                            <ul className="clearfix">
                                {this.biaoqingList()}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="move-y" ref="moveY"></div>
            </div>
        )
    }
    componentDidMount() {
        const { box, list, scrollBox, scroll, moveY, listContent, editorBox } = this.refs;

        const c = $(editorBox).outerHeight() + $(moveY).outerHeight() + 6;

        const oScrollMove = new ScrollMove(box, list, scrollBox, scroll, moveY, {
            moveYH: $(moveY).height() + $(editorBox).outerHeight(),
            setListH: !!this.props.h ? H => $('#listBox').height(H + c) : false
        });

        oScrollMove.init();
    }
    componentDidUpdate() {
        const record = this.getUser().record;

        if (!record || record.length <= 0 || orecordEnd == record[record.length - 1].content) return;

        orecordEnd = record[record.length - 1].content;

        const { box, list, scrollBox, scroll, editorContent } = this.refs;

        setTimeout(() => {
            let [sbh, sh] = [
                $(scrollBox).height(),
                $(scroll).height()
            ];

            (sbh == sh) && (sh = 17);

            let [listT, scrollT] = [
                $(box).height() - $(list).height(),
                sbh - sh
            ];

            listT > 0 && (listT = 0);
            scrollT < 0 && (scrollT = 0);
            $(list).css('top', listT);
            $(scroll).css('top', scrollT);
            $(editorContent).focus();
        }, 30);
    }
    imgaeChange(ev) {
        if (!ev.target.files[0]) return;
        window.sendImgHandle(ev.target.files[0]).then(src => {
            this.props.dispatch({ type: appCatWindow.SENDFILE, data: { show: true } });
            this.props.dispatch(appCatWindow.sendimg(src, this.props.id));
        });
    }
    close() {
        const { dispatch, index } = this.props;
        if (typeof index == 'number') {
            dispatch(appCatWindow.close(index));
        }
        else {
            dispatch({ type: appCatWindow.REBOXLIST, list: [] });
            dispatch({ type: appCatWindow.FILTER, value: '' });
        }
    }
    getUser() {
        const { index, appCat, id } = this.props;

        const arr = typeof index == 'number' ? appCat.list : appCat.boxList;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                return arr[i];
            }
        }
        return {};
    }
    send(obj) {
        const { index, dispatch } = this.props;
        dispatch(appCatWindow.send(() => obj.innerHTML = '', index))
    }
    keyDownSend(ev) {
        if (!ev.ctrlKey || ev.keyCode !== 13) return;
        const { index, dispatch } = this.props;
        const obj = ev.target;
        dispatch(appCatWindow.send(() => obj.innerHTML = '', index));
    }
    showbq() {
        const { index, dispatch } = this.props;
        dispatch(appCatWindow.showbiaoqingbao(index))
    }
    keyUpEditor(ev) {
        const { index, dispatch } = this.props;
        if (ev.ctrlKey && ev.keyCode == 13) return;
        dispatch(appCatWindow.editorchange(ev.target.innerHTML, index));
    }
    addbiaoqingbao(n, src, obj) {
        const { index, dispatch } = this.props;
        obj.innerHTML += `<img src='${src}' data-index=${n} />`;
        dispatch(appCatWindow.editorchange(obj.innerHTML, index));
        dispatch(appCatWindow.showbiaoqingbao(index));
    }
    videoCallShow() {
        const { dispatch, id } = this.props;
        dispatch(appCatWindow.videoCallShow(id));
    }
    biaoqingList() {

        let arr = [];

        this.props.appCat.biaoqing.forEach((item, index) => {
            arr.push(
                <li key={index}>
                    <img src={item.src} onClick={() => this.addbiaoqingbao(index, item.src, this.refs.editorContent)} />
                </li>
            );
        });

        return arr;
    }
    contentList(record, miphoto, hehphoto, biaoqing) {
        let [arr, req, reqn, url, image] = [
            [],
            /{{表情\d{1,}}}/gi,
            /\d{1,}/i,
            /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g,
            /^\{\{自定义图片(\/image\/.+)\}\}$/
        ];

        Array.isArray(record) && record.forEach((item, index) => {

            let [content] = [item.content];

            const [oZDYImg, hphoto, oDate] = [
                content.match(image),
                item.send == 0 ? miphoto : hehphoto,
                new Date(item.time)
            ];

            const [getFullYea, getMonth, getDate, getHours, getMinutes] = [
                oDate.getFullYear(),
                oDate.getMonth() + 1 > 9 ? oDate.getMonth() + 1 : '0' + (oDate.getMonth() + 1),
                oDate.getDate() > 9 ? oDate.getDate() : '0' + oDate.getDate(),
                oDate.getHours() > 9 ? oDate.getHours() : '0' + oDate.getHours(),
                oDate.getMinutes() > 9 ? oDate.getMinutes() : '0' + oDate.getMinutes()
            ];

            if (oZDYImg) {
                arr.push(
                    <li className="clearfix" key={index} onMouseDown={ev => { ev.stopPropagation() }}>
                        <div className={item.send == 0 ? 'mi' : 'he'}>
                            <div className="img-box">
                                <img src={hphoto} alt="" />
                            </div>
                            <div className="neirong">
                                <div className="time">{`${getFullYea}/${getMonth}/${getDate}  ${getHours}:${getMinutes}`}</div>
                                <div className="jilv">
                                    <img onClick={() => this.showImg(oZDYImg[1])} src={oZDYImg[1]} className="zdy" />
                                </div>
                            </div>
                        </div>
                    </li>
                );
            }
            else {
                content = content.replace(/%%nbsp;/g, '<br>').replace(/nbsp;/g, '&nbsp;');

                const [aBiaoqing, aURL] = [
                    item.content.match(req),
                    item.content.match(url)
                ];

                if (aURL) {
                    aURL.forEach(item => {
                        const oA = `<a href="${item}" target="_blank" title="${item}">${item}</a>`;
                        content = content.replace(item, oA);
                    });
                }

                if (aBiaoqing) {
                    aBiaoqing.forEach((item) => {
                        let n = item.match(reqn)[0];
                        if (!isNaN(Number(n)) && biaoqing[Number(n)]) {
                            content = content.replace(item, `<img src='${biaoqing[Number(n)].src}' data-index=${n} />`);
                        }
                    })
                }

                arr.push(
                    <li className="clearfix" key={index} onMouseDown={ev => { ev.stopPropagation() }}>
                        <div className={item.send == 0 ? 'mi' : 'he'}>
                            <div className="img-box">
                                <img src={hphoto} alt="" />
                            </div>
                            <div className="neirong">
                                <div className="time">{`${getFullYea}/${getMonth}/${getDate}  ${getHours}:${getMinutes}`}</div>
                                <div className="jilv" dangerouslySetInnerHTML={{ __html: content }} />
                            </div>
                        </div>
                    </li>
                );
            }
        });

        return arr;
    }
    editorPaste() {
        setTimeout(() => $('.editor-textarea').html(window.getDocumentText($('.editor-textarea').html())), 18);
    }
    showImg(src) {
        this.props.dispatch({ type: appCatWindow.SHOWIMG, data: { show: true, src } });
    }
    audioCallShow() {
        const { dispatch, id } = this.props;
        dispatch(appCatWindow.audioCallShow(id));
    }
    constructor(props) {
        super(props);
        this.imgaeChange = this.imgaeChange.bind(this);
        this.contentList = this.contentList.bind(this);
        this.close = this.close.bind(this);
        this.getUser = this.getUser.bind(this);
        this.send = this.send.bind(this);
        this.keyDownSend = this.keyDownSend.bind(this);
        this.showbq = this.showbq.bind(this);
        this.keyUpEditor = this.keyUpEditor.bind(this);
        this.addbiaoqingbao = this.addbiaoqingbao.bind(this);
        this.videoCallShow = this.videoCallShow.bind(this);
        this.biaoqingList = this.biaoqingList.bind(this);
        this.editorPaste = this.editorPaste.bind(this);
        this.showImg = this.showImg.bind(this);
        this.audioCallShow = this.audioCallShow.bind(this);
    }
}

export default connect((state, props) => {
    return {
        id: props.id,
        h: props.h,
        index: props.index,
        appCat: state.appCat,
        appActive: state.appActive
    }
})(CatContent);