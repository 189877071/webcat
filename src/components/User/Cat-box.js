import React, { Component } from 'react'

import { connect } from 'react-redux'

import Content from './Content'

import { appCatWindow } from '../../store/app/action'

class CatBox extends Component {
    render() {

        const { dispatch, id, appCat, index } = this.props;

        let user = null;

        for (let i = 0; i < appCat.list.length; i++) {
            if (appCat.list[i].id === id) {
                user = appCat.list[i];
                break;
            }
        }

        if (!user) return (<div></div>);

        const { offset, headphoto, name, username, synopsis, login } = user;

        const [oName, headClass, stateClass, state, oSynopsis, close] = [
            name ? name : username,
            login == 0 ? 'gray' : '',
            login == 0 ? 'off' : 'on',
            () => {
                if (login == 1) {
                    return <span className="on"><i className="iconfont icon-zaixian"></i> 在线</span>
                }
                else {
                    return <span className="off"><i className="iconfont icon-lixian"></i> 离线</span>
                }
            },
            synopsis ? synopsis : '该用户很羞涩，不善于介绍自己',
            () => dispatch(appCatWindow.close(index))
        ];

        return (
            <div className="cat-box" ref="box" style={offset} >
                <div className="header-box clearfix" ref="header">
                    <div className="left">
                        <img src={headphoto} alt={oName} className={headClass} />
                    </div>

                    <div className="right">

                        <div className="title">
                            {oName}
                            {state()}
                        </div>

                        <div className="jianjie">
                            {oSynopsis}
                        </div>
                    </div>

                    <div
                        className="close"
                        title="关闭"
                        onMouseDown={ev => ev.stopPropagation()}
                        onClick={close}
                    >
                        <i className="iconfont icon-iconfontcha"></i>
                    </div>

                </div>

                <Content id={id} index={index}></Content>
            </div>
        )
    }
    componentDidMount() {
        const { box, header } = this.refs;

        const { index, dispatch } = this.props;

        windowDrag(box, header);

        $(header).on('mouseup', () => dispatch(appCatWindow.reoffset(index, $(box).offset())));

        $(box).on('mousedown', () => dispatch(appCatWindow.setzindex(index)));
    }
}

export default connect((state, props) => {
    return {
        id: props.id,
        index: props.index,
        appCat: state.appCat,
        setZindex: state.setZindex
    }
})(CatBox);