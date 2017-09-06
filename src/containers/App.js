import React, { Component } from 'react'

import { findDOMNode } from 'react-dom'

import { connect } from 'react-redux'

import { history } from '../config'

import UserBox from '../components/User/Box'

import CatAllBox from '../components/User/Cat-all-box'

import CatBox from '../components/User/Cat-box'

import VedioCall from '../components/User/Vedio-call'

import AudioCall from '../components/User/Audio-call'

import Mask from '../components/Mask/Mask-box'

import ShowImg from '../components/Mask/Show-img'

import SendImg from '../components/Mask/Send-img'

import Set from '../components/Mask/Set'

import UpdatePhoto from '../components/Mask/Update-photo'

import { appUserWindow } from '../store/app/action'

import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

class App extends Component {

    render() {
        const { list, videoShow, sendimg, showImg, audioShow, setShow, upatePhoto } = this.props;

        let CatBoxList = [];

        list.forEach((item, index) => {
            CatBoxList.push(<CatBox key={index} id={item.id} index={index}></CatBox>);
        });

        const Oset = upatePhoto ? UpdatePhoto : Set;

        return (
            <div>
                <UserBox></UserBox>

                <CatAllBox></CatAllBox>

                {videoShow && <VedioCall></VedioCall>}

                {audioShow && <AudioCall></AudioCall>}

                {CatBoxList}

                <Mask setStyle={sendimg ? 'display' : 'none'}><SendImg /></Mask>

                <Mask setStyle={showImg ? 'display' : 'none'}><ShowImg /></Mask>

                <Mask setStyle={setShow ? 'display' : 'none'}>
                    <CSSTransitionGroup
                        transitionName="transitionGroup"
                        transitionLeave={false}
                        transitionEnterTimeout={300}
                        component="div"
                    >
                        <Oset key={upatePhoto}></Oset>
                    </CSSTransitionGroup>
                </Mask>
                {/*
                <CSSTransitionGroup
                    transitionName="transitionGroup"
                    transitionLeave={false}
                    transitionEnterTimeout={300}
                    style={this.props.style}
                    component="div"
                >
                
                </CSSTransitionGroup>
                 
                  */}
            </div>
        )
    }
    componentWillMount() {
        const { loaderOnoff, loginOnoff } = this.props;

        if (!loaderOnoff) {
            history.push('/');
            return;
        }

        loginOnoff || history.push('/login');
    }
    componentDidMount() {
        this.props.dispatch(appUserWindow.alluserdata());
        window.onbeforeunload = function (ev) {
            ev.returnValue = '你确认要离开吗？';
        }
    }
}

export default connect((state, props) => {
    return {
        loginOnoff: state.loginOnoff,
        loaderOnoff: state.loaderOnoff,
        list: state.appCat.list,
        videoShow: state.appCat.videoCall.show,
        audioShow: state.appCat.audioCall.show,
        sendimg: state.appCat.file.show,
        showImg: state.appCat.showImg.show,
        setShow: state.appSet.show,
        upatePhoto: state.appSet.upatePhoto
    }
})(App);