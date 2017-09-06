import React, { Component } from 'react'

import { connect } from 'react-redux'

import { appCatWindow } from '../../store/app/action'

class Connection extends Component {
    render() {
        const { hename, myname, headphoto, jujue, jiesou } = this.props;
        return (
            <div className="camera">
                <div className="clearfix">
                    <div className="left">
                        <div className="camera-icon"><i className="iconfont icon-shexiangtou1"></i></div>
                        <div className="camera-name">{hename}</div>
                    </div>
                    <div className="right">
                        <div className="camera-icon"><i className="iconfont icon-shexiangtou1"></i></div>
                        <div className="camera-name">{myname}</div>
                    </div>
                </div>
                <div className="camera-mask">
                    <p><img src={headphoto} alt="" /></p>
                    <p><span className="f00">"{hename}"</span> 向你发送视频通话请求！</p>
                    <p>
                        <button onClick={jiesou}>接受</button>
                        <button onClick={jujue}>拒绝</button>
                    </p>
                </div>
            </div>
        )
    }
}

class Iframe extends Component {
    render() {
        const { hename, myname } = this.props;

        return (
            <div className="camera">
                <iframe
                    src="/videoCall.html"
                    frameBorder="0"
                    height="240"
                    width="670"
                    name="videoCall"
                    className="caream-iframe"
                ></iframe>
                <div className="clearfix camera-name">
                    <div className="left">{hename}</div>
                    <div className="right">{myname}</div>
                </div>
                <div className="camera-o-m" onMouseDown={ev => {
                    ev.stopPropagation();
                    ev.preventDefault();
                }}></div>
            </div>
        )
    }
    componentDidMount() {
        if (window.videoCallData.config) {
            let videoCall = window.frames['videoCall'];
            if (videoCall) {
                videoCall.onload = () => {
                    videoCall.window.setInit(window.videoCallData.config);
                }
            }
        }
    }
}

class WebRTC extends Component {
    render() {
        const { dispatch, videoCall } = this.props;

        const { zIndex, opaction, hename, myname, headphoto } = videoCall;

        const [jujue, boxDown, close, jiesou] = [
            () => dispatch(appCatWindow.videojujue()),
            () => dispatch(appCatWindow.videoCallBoxDown()),
            () => confirm('你确定要关闭吗？') && dispatch(appCatWindow.videojujue(true)),
            () => dispatch(appCatWindow.videotongyi())
        ];

        const [ConnectionProps, IframeProps] = [
            { hename, myname, headphoto, jujue, jiesou },
            { hename, myname }
        ]

        return (
            <div className="vedio-call-box" ref="box" onMouseDown={boxDown} style={{ zIndex }} >

                <div className="camera-header" ref="header">
                    <div className="guaduan" title="挂断" onClick={close}>
                        <i className="iconfont icon-iconfontcha"></i>
                    </div>
                </div>

                {opaction == 1 ? <Iframe {...IframeProps}></Iframe> : <Connection {...ConnectionProps}></Connection>}
            </div>
        )
    }
    componentDidMount() {
        const { box, header } = this.refs;

        const [W, bW, H, bH] = [
            $(window).width(),
            $(box).width(),
            $(window).height(),
            $(box).height()
        ]

        $(box).css({
            left: (W - bW) / 2,
            top: (H - bH) / 4
        });

        windowDrag(box, header);
    }
}

export default connect((state, props) => {
    return {
        videoCall: state.appCat.videoCall
    }
})(WebRTC);
