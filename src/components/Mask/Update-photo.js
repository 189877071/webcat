import React, { Component } from 'react'

import { connect } from 'react-redux'

import { appSetWinodw } from '../../store/app/action'

import editorPhoto from '../../editorPhoto'

class UpdatePhoto extends Component {

    render() {
        const { active, img } = this.props;

        return (
            <div className="update-photo" ref="box">
                <h1><i className="iconfont icon-yonghu"></i>修改头像</h1>
                <div className="close" title="返回" onClick={this.close}>
                    <i className="iconfont icon-fanhui"></i>
                </div>

                <div className="photo-list clearfix">
                    <div className={active == 0 ? 'set-photo active' : 'set-photo'} ref="aImg1">
                        <img src={img[0]} alt="" />
                    </div>
                    <div className={active == 1 ? 'set-photo active' : 'set-photo'} ref="aImg2">
                        <img src={img[1]} alt="" />
                    </div>
                    <div className={active == 2 ? 'set-photo active' : 'set-photo'} ref="aImg3">
                        <img src={img[2]} alt="" />
                    </div>
                </div>

                <div className="photo-editor" ref="editBox">
                    <div className="kuang" ref="odownBox">
                        <ul className="wmask">
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                        <ul className="xuxian" ref="odown">
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>

                    <img src="" alt="" ref="oImg" />
                </div>

                <div className="caozuo">
                    <a href="javascript:;" title="选择图片">
                        <i className="iconfont icon-dakai"></i>
                        <input type="file" ref="file" accept="image/*" />
                    </a>
                    <a href="javascript:;" title="放大" ref="fangda"><i className="iconfont icon-fangda"></i></a>
                    <a href="javascript:;" title="缩小" ref="suoxiao"><i className="iconfont icon-suoxiao"></i></a>
                    <a href="javascript:;" title="右旋转" ref="xuanzhuanR"><i className="iconfont icon-xuanzhuanRight"></i></a>
                    <a href="javascript:;" title="左旋转" ref="xuanzhuanL"><i className="iconfont icon-xuanzhuanLeft"></i></a>
                    <a href="javascript:;" title="还原" ref="huanyuan"><i className="iconfont icon-huanyuan"></i></a>
                    <a href="javascript:;" title="确定" ref="queren"><i className="iconfont icon-queren"></i></a>
                </div>

            </div>
        )
    }
    componentDidMount() {
        const { box, aImg1, aImg2, aImg3, queren } = this.refs;

        const { dispatch, active, img } = this.props;

        setMarginTop(box);

        const oEditor = new editorPhoto(this.props.src, this.refs, data => {
            dispatch({ type: appSetWinodw.SETIMGSRC, data: [data.src1, data.src2, data.src3] })
        });

        oEditor.init();
        aImg1.onclick = () => dispatch({ type: appSetWinodw.SETIMGACTIVE, num: 0 });
        aImg2.onclick = () => dispatch({ type: appSetWinodw.SETIMGACTIVE, num: 1 });
        aImg3.onclick = () => dispatch({ type: appSetWinodw.SETIMGACTIVE, num: 2 });

        queren.onclick = () => {
            dispatch({ type: appSetWinodw.SETHEADPHOTO, setPhoto: true });
            this.close();
        }
    }
    close = () => this.props.dispatch({ type: appSetWinodw.UPDATEPHOTO, onoff: false });
}

export default connect((state, props) => {
    return {
        src: state.appSet.active.headphoto,
        img: state.appSet.img,
        active: state.appSet.imgActive
    }
})(UpdatePhoto);
