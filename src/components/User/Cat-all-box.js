import './style.scss'
import React, { Component } from 'react'

import { connect } from 'react-redux'

import Content from './Content'

import Input from '../Common/Input'

import CatAllList from './Cat-all-list'

import { appCatWindow } from '../../store/app/action'

class CatAllBox extends Component {
    render() {

        const { dispatch, appCat, activeUser } = this.props;

        const [list, active, miphoto, zindex, setAllZindex, filterProps, allClose] = [
            appCat.boxList,
            appCat.boxActive,
            activeUser.active.headphoto,
            appCat.boxZindex,
            () => dispatch(appCatWindow.setallzindex()),
            {
                value: appCat.filter,
                action: appCatWindow.FILTER
            },
            () => {
                dispatch({ type: appCatWindow.REBOXLIST, list: [] });
                dispatch({ type: appCatWindow.FILTER, value: '' });
            }
        ]

        const [style, name, LoginState, id] = [
            {
                display: list.length < 1 ? 'none' : 'block',
                zIndex: zindex
            },
            list[active] ? ((list[active].name) ? list[active].name : list[active].username) : '',
            () => {
                if (list[active] && list[active].login == 1) {
                    return <span className="on"><i className="iconfont icon-zaixian"></i> 在线</span>
                }
                else {
                    return <span className="off"><i className="iconfont icon-lixian"></i> 离线</span>
                }
            },
            list[active] ? list[active].id : false
        ];

        return (
            <div className="cat-all-box clearfix" id="catAllBox" ref="box" style={style} onMouseDown={setAllZindex}>
                <div className="left cat-all-box-left">

                    <div className="search">
                        <Input type="search" {...filterProps} />
                        <i className="iconfont icon-search"></i>
                    </div>

                    <CatAllList></CatAllList>

                </div>

                <div className="right cat-all-box-right">
                    <div className="top" ref="top">
                        <h1>
                            {name}
                            {LoginState()}
                        </h1>
                        <div className="close" title="关闭" onClick={allClose}>
                            <i className="iconfont icon-iconfontcha"></i>
                        </div>
                    </div>

                    <Content id={id} h={329}></Content>

                </div>
            </div>
        )
    }
    componentDidMount() {

        const { box, top } = this.refs;

        const [W, bW, H, bH] = [
            $(window).width(),
            $(box).width(),
            $(window).height(),
            $(box).height()
        ];

        $(box).css({ left: (W - bW) / 2, top: (H - bH) / 2 });

        windowDrag(box, top);
    }
}

export default connect((state, props) => {
    return {
        appCat: state.appCat,
        activeUser: state.appActive,
    }
})(CatAllBox);