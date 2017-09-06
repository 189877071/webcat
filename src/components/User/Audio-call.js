import React, { Component } from 'react'

import { connect } from 'react-redux'

import { appCatWindow } from '../../store/app/action'

class Connection extends Component {
    render() {
        const { headphoto, hename, jiesou, jujue } = this.props;
        return (
            <div>
                <div className="yuyin"><i className="iconfont icon-yuyin"></i></div>

                <div className="yuyin-h-b" onClick={() => jujue(true)}>
                    <div className="yuyin-hover"><i className="iconfont icon-yuyin"></i></div>
                </div>

                <p className="he-name">等待初始化……</p>

                <div className="audio-mask">
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
        const { hename } = this.props;
        return (
            <div>
                <iframe
                    src="/audioCall.html"
                    frameBorder="0"
                    height="250"
                    width="400"
                    name="audioCall"
                    className="audio-iframe"
                ></iframe>
                <p className="he-name">正在与 <span>{hename}</span> 进行语音通话……</p>
                <div className="audio-i-mask" onMouseDown={ev => {
                    ev.stopPropagation();
                    ev.preventDefault();
                }}></div>
            </div>
        )
    }
    componentDidMount() {
        if (window.audioCallData.config) {
            let audioCall = window.frames['audioCall'];
            if (audioCall) {
                audioCall.onload = () => {
                    audioCall.window.setInit(window.audioCallData.config);
                }
            }
        }
    }
}

class AudioCallBox extends Component {
    render() {
        const { audioCall, dispatch } = this.props;

        const ConnectionProps = {
            headphoto: audioCall.headphoto,
            hename: audioCall.hename,
            jiesou() {
                dispatch(appCatWindow.audiotongyi());
            },
            jujue() {
                dispatch(appCatWindow.audiojujue());
            }
        };

        return (
            <div className="audio-call-box" ref="box" onMouseDown={this.boxDown} style={{ zIndex: audioCall.zIndex }}>
                <div className="audio-header" ref="header">
                    <div className="guaduan" title="挂断" onClick={this.close}>
                        <i className="iconfont icon-iconfontcha"></i>
                    </div>
                </div>
                {audioCall.opaction == 2 ? <Connection {...ConnectionProps}></Connection> : <Iframe hename={audioCall.hename}></Iframe>}
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
            top: (H - bH) / 2
        });

        windowDrag(box, header);
    }
    boxDown() {
        this.props.dispatch(appCatWindow.audioCallBoxDown());
    }
    close() {
        confirm('你确定要关闭吗？') && this.props.dispatch(appCatWindow.audiojujue(true));
    }
    constructor(props) {
        super(props);
        this.boxDown = this.boxDown.bind(this);
        this.close = this.close.bind(this);
    }
}

export default connect((state, props) => {
    return {
        audioCall: state.appCat.audioCall
    }
})(AudioCallBox);