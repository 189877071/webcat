import React, { Component } from 'react'

import { connect } from 'react-redux'

import { appCatWindow } from '../../store/app/action'

import ScrollMove from '../../scrollMove'

class CatAllList extends Component {
    render() {
        const { list, active, appCat, dispatch } = this.props;

        const [ali, filter, setListActive, listClose, dragStart, doubleClick] = [
            [],
            appCat.filter,
            num => {
                dispatch({ type: appCatWindow.BOXACTIVE, num });
                list[num].inforActive = false;
                dispatch({ type: appCatWindow.REBOXLIST, list: list });
            },
            (ev, index) => {
                ev.stopPropagation();
                dispatch(appCatWindow.boxclose(index));
                dispatch({ type: appCatWindow.FILTER, value: '' });
            },
            (ev, index) => {
                const [L, T, maxL, maxT] = [
                    ev.pageX - $(ev.target).offset().left,
                    ev.pageY - $(ev.target).offset().top,
                    $(window).width() - 450,
                    $(window).height() - 510
                ];

                $('body').one('dragend', function (ev) {
                    ev.preventDefault();

                    let [left, top] = [
                        ev.pageX - L,
                        ev.pageY - T
                    ];

                    if (left < 0) left = 0;

                    if (top < 0) top = 0;

                    if (left > maxL) left = maxL;

                    if (top > maxT) top = maxT;

                    dispatch(appCatWindow.boxlistdrag(index, { left, top }));
                });
            },
            index => {
                const { left, top } = $('#catAllBox').offset();

                let [L, T, maxL, maxT] = [
                    left + 20,
                    top + 20,
                    $(window).width() - 450,
                    $(window).height() - 510
                ];

                if (L > maxL) L = maxL;

                if (T > maxT) T = maxT;

                dispatch(appCatWindow.boxlistdrag(index, { left: L, top: T }));
            }
        ]

        list.forEach((item, index) => {
            const oName = item.name ? item.name : item.username;

            if (filter != '' && oName.search(filter) == -1) return;

            const time = new Date(item.logindate);

            const liBg = item.inforActive ? 'infor-active' : '';

            ali.push(
                <li
                    draggable={true}
                    onDragStart={(ev) => dragStart(ev, index)}
                    onDoubleClick={() => doubleClick(index)}
                    className={active == index ? 'active' : liBg}
                    key={index}
                    onClick={() => setListActive(index)}
                >
                    <img src={item.headphoto} alt="" className={item.login == 1 ? '' : 'gray'} />
                    {/*inforActive  */}
                    <div className="title">
                        <div className="title-name">{oName}</div>
                        <div className="jianjie">{item.synopsis ? (item.synopsis.length > 6 ? item.synopsis.slice(0,6) + '……' : item.synopsis) : '该用户很羞涩……'}</div>
                    </div>

                    <div className="close" title="关闭" onClick={(ev) => listClose(ev, index)}>
                        <i className="iconfont icon-iconfontcha"></i>
                    </div>

                    <div className="time">{`${time.getMonth() + 1}-${time.getDate()}`}</div>
                </li>
            );
        });

        return (
            <div className="list-box" id="listBox" ref="box">
                <ul ref="list">
                    {ali}
                </ul>
                <div className="scroll-box" ref="scrollBox">
                    <div className="scroll" ref="scroll"></div>
                </div>
                <div style={{ display: 'none' }} ref="moveY"></div>
            </div>
        )
    }
    componentDidMount() {
        const { box, list, scrollBox, scroll, moveY } = this.refs;
        const oScrollMove = new ScrollMove(box, list, scrollBox, scroll, moveY, {
            scrollBoxColor: 'rgba(255,255,255,.3)'
        });
        oScrollMove.init();
    }
}

export default connect((state, props) => {
    return {
        list: state.appCat.boxList,
        active: state.appCat.boxActive,
        appCat: state.appCat
    }
})(CatAllList);