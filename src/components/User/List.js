import React, { Component } from 'react'

import { connect } from 'react-redux'

import { appUserWindow } from '../../store/app/action'

import ScrollMove from '../../scrollMove'

class List extends Component {
    render() {
        const { dispatch, users } = this.props;

        const [alist, showCat] = [
            [],
            index => dispatch(appUserWindow.showCat(index))
        ];

        users.forEach(function (item, index) {
            let { headphoto, name, username, synopsis, login, leaveInfor } = item;
            name = name ? name : username;
            synopsis = synopsis ? synopsis : '该用户很羞涩，不善于介绍自己'

            const imgClass = login == 0 ? 'gray' : 'lineimg';

            leaveInfor = !leaveInfor ? false : (leaveInfor > 99 ? '99+' : leaveInfor);

            const stateText = () => {
                if (login == 1) {
                    return <span className="online"><i className="iconfont icon-zaixian"></i> 在线</span>
                }
                else {
                    return <span className="leave"><i className="iconfont icon-lixian"></i> 离线</span>
                }
            }

            alist.push(
                <li key={index} className="clearfix" onClick={() => showCat(index)}>
                    <div className="left">
                        {index < 15 ? <img className={imgClass} src={headphoto} alt="头像" />:<img className={imgClass} src="/image/loader.gif" data-src={headphoto} alt="头像" />}
                    </div>
                    <div className="right">
                        <div className="title">{name} {stateText()}</div>
                        <div className="jianjie">{synopsis} {leaveInfor && <span className="leave-infor">{leaveInfor}</span>}</div>
                    </div>
                </li>
            )
        });

        return (
            <div>
                <div className="list-box" ref="box">
                    <ul ref="list">
                        {alist}
                    </ul>
                    <div className="scroll-box" ref="scrollBox">
                        <div className="scroll" ref="scroll"></div>
                    </div>
                </div>
                <div className="move-y" ref="moveY"></div>
            </div>
        )
    }

    componentDidMount() {

        const { box, list, scrollBox, scroll, moveY } = this.refs;

        const oScrollMove = new ScrollMove(box, list, scrollBox, scroll, moveY, {
            loadImg: (t) => {
                let aLi = $(list).find('li');
                for (let i = 0; i < aLi.length; i++) {
                    let obj = aLi.eq(i).find('img');
                    let src = obj.attr('data-src');
                    if (aLi.eq(i).position().top < t && src) {
                        loaderImg(src, obj);
                        $(obj).removeAttr('data-src');
                    }
                }
            }
        });

        oScrollMove.init();
    }
}

export default connect((state, props) => {
    return {
        users: state.appActive.users
    }
})(List);