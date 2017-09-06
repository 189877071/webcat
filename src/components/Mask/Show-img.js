import React, { Component } from 'react'

import { connect } from 'react-redux'

import { appCatWindow } from '../../store/app/action'

class ShowImg extends Component {
    render() {
        const { src } = this.props;
        return (
            <div className="show-img" ref="box">
                <div className="show-img-close" onClick={this.close}><i className="iconfont icon-iconfontcha"></i></div>
                <img src={src} alt="" />
            </div>
        )
    }
    close = () => {
        this.props.dispatch({ type: appCatWindow.SHOWIMG, data: {} });
    }
    componentDidMount() {
        setMarginTop(this.refs.box);
    }

}

export default connect(state => {
    return {
        src: state.appCat.showImg.src
    }
})(ShowImg);