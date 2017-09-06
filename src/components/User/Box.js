import './style.scss'

import React, { Component } from 'react'

import { connect } from 'react-redux'

import List from './List'

import { appUserWindow, appSetWinodw } from '../../store/app/action'

class UserListBox extends Component {
    render() {

        const { dispatch, activeUser } = this.props;

        const { age, email, headphoto, id, logindate, ext, name, synopsis, username } = activeUser.active;

        const [zindex, audio, boxZindex, audioOff, setShow] = [
            activeUser.zindex,
            activeUser.audio,
            () => dispatch(appUserWindow.setzindex()),
            () => {
                let off = localStorage.getItem('audio');

                off ? localStorage.removeItem('audio') : localStorage.setItem('audio', true);

                dispatch({ type: appUserWindow.AUDIO, off });
            },
            () => {
                dispatch(appSetWinodw.show());
            }
        ];

        const [audioClass, audioText] = [
            audio ? 'iconfont shengyin icon-hekriconzhuijiashengyinkai' : 'iconfont shengyin icon-hekriconzhuijiashengyinguan44',
            audio ? '声音开启' : '声音关闭'
        ];

        return (
            <div className="user-box" ref="box" style={{ zIndex: zindex }} onMouseDown={boxZindex}>
                <div className="header">
                    <h1 ref="header"><i className="iconfont icon-caidan"></i> 用户列表</h1>
                    <div className="u-exit" title="退出" onClick={this.exit}><i className="iconfont icon-iconfontcha"></i></div>
                    <div className="header-box clearfix">
                        <div className="left">
                            <img src={headphoto} alt="头像" onClick={setShow} />
                        </div>
                        <dl className="right">
                            <dt>{name ? name : username}</dt>
                            <dd>{synopsis ? synopsis : '如果看着很不顺眼，那就填点什么吧！'}</dd>
                            <dd>
                                <a href="javascript:;" onClick={audioOff}>
                                    <i className={audioClass}></i>{audioText}
                                </a>
                                <a href="javascript:;" onClick={setShow}>
                                    <i className="iconfont icon-shezhi"></i>设置
                                </a>
                            </dd>
                        </dl>
                    </div>
                </div>

                <List></List>

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
        ];

        $(box).css({
            left: 100,
            top: (H - bH) / 2
        })

        windowDrag(box, header);
    }
    exit = () => {
        if (confirm('确定要退出吗？')) {
            this.props.dispatch(appUserWindow.exit());
        }
    }
}

export default connect((state, props) => {
    return {
        activeUser: state.appActive,
    }
})(UserListBox);