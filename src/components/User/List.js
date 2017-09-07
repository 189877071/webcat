import React, { Component } from 'react'

import { connect } from 'react-redux'

import { appUserWindow } from '../../store/app/action'

import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

import ScrollMove from '../../scrollMove'

var imgLoad = true;

class RImage extends Component {
    render() {
        const { src, oclass } = this.props;
        return (
            <CSSTransitionGroup
                transitionName="transitionGroup"
                transitionLeave={false}
                transitionEnterTimeout={300}
            >
                <img className={oclass} src={src} key={src} />
            </CSSTransitionGroup>
        )
    }
}

class Li extends Component {

    render() {
        let { showCat, index, user: { headphoto, name, username, synopsis, login, leaveInfor } } = this.props;

        name = name ? name : username;

        synopsis = synopsis ? synopsis : '该用户很羞涩，不善于介绍自己';

        leaveInfor = !leaveInfor ? false : (leaveInfor > 99 ? '99+' : leaveInfor);

        return (
            <li className="clearfix" onClick={() => showCat(index)} ref="box">
                <div className="left">
                    <RImage oclass={login === 0 ? 'gray' : 'lineimg'} src={this.state.src} />
                </div>

                <div className="right">
                    <div className="title">{name} {this.stateText()}</div>
                    <div className="jianjie">{synopsis} {leaveInfor && <span className="leave-infor">{leaveInfor}</span>}</div>
                </div>
            </li>
        )
    }

    stateText() {
        if (this.props.user.login == 1) {
            return <span className="online"><i className="iconfont icon-zaixian"></i> 在线</span>
        }
        else {
            return <span className="leave"><i className="iconfont icon-lixian"></i> 离线</span>
        }
    }

    componentDidMount() {
        const { box } = this.refs;

        this.setState({ firstSrc: this.props.user.headphoto });

        if (this.props.index < 10) {
            this.imgLoad();
        }
        else {
            setTimeout(() => {
                this.imgLoad();
            }, this.props.index * 10 + 100);
        }
    }

    componentDidUpdate() {
        if (this.state.firstSrc != this.props.user.headphoto) {
            this.setState({ src: this.props.user.headphoto, firstSrc: this.props.user.headphoto });
        }
    }

    imgLoad() {
        let oimg = new Image();
        oimg.onload = () => {
            oimg = null;
            this.setState({ src: this.props.user.headphoto });
        }
        oimg.src = this.props.user.headphoto;
    }

    constructor() {
        super();
        this.stateText = this.stateText.bind(this);
        this.imgLoad = this.imgLoad.bind(this);
        this.state = { src: '/image/loader.jpg' }
    }
}

class List extends Component {
    render() {
        const { dispatch, users } = this.props;

        let alist = [];

        users.forEach((item, index) => {
            alist.push(<Li user={item} key={index} index={index} showCat={index => dispatch(appUserWindow.showCat(index))}></Li>)
        })

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

        const oScrollMove = new ScrollMove(box, list, scrollBox, scroll, moveY);

        oScrollMove.init();
    }

    componentDidUpdate() {
        const { box, list } = this.refs;
    }

    constructor() {
        super();
    }
}

export default connect((state, props) => {
    return {
        users: state.appActive.users
    }
})(List);