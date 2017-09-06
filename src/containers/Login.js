import React, { Component } from 'react'

import { connect } from 'react-redux'

import { history } from '../config'

import Banner from '../components/Login/Banner'

import LoginBox from '../components/Login/Login-box'

import Mask from '../components/Mask/Mask-box'

import Moblie from '../components/Mask/Moblie'

import UpdatePass from '../components/Mask/Update-pass'

import Load from '../components/Mask/Load'

import RegOk from '../components/Mask/Reg-ok'

import GetUsers from '../components/Mask/Get-users'

import { loginMaskAction } from '../store/login/action'

class Loader extends Component {
    render() {
        const { active, mask, register, login } = this.props;
        return (
            <div ref="box">
                <Banner></Banner>

                <LoginBox active={active}></LoginBox>

                <Mask setStyle={mask.android.display}>
                    <Moblie title={mask.android.title} src={mask.android.src} />
                </Mask>

                <Mask setStyle={mask.ios.display}>
                    <Moblie title={mask.ios.title} src={mask.ios.src} />
                </Mask>

                <Mask setStyle={mask.web.display}>
                    <Moblie title={mask.web.title} src={mask.web.src} />
                </Mask>

                <Mask setStyle={mask.updatepass.display}>
                    <UpdatePass />
                </Mask>

                <Mask setStyle={(register.stop == 3 || login.stop == 2) ? 'block' : 'none'}>
                    <Load />
                </Mask>

                <Mask setStyle={register.stop == 4 ? 'block' : 'none'}>
                    <RegOk />
                </Mask>
                <Mask setStyle={mask.getusers ? 'block' : 'none'}>
                    <GetUsers></GetUsers>
                </Mask>
            </div>
        )
    }

    componentDidMount() {
        setMarginTop(this.refs.box);
    }

    componentWillMount() {
        const { loaderOnoff, loginOnoff } = this.props;

        if (!loaderOnoff) {
            history.push('/');
            return;
        }

        loginOnoff && history.push('/app');
        if (!sessionStorage.getItem('getusers')) {
            setTimeout(() => {
                this.props.dispatch({ type: loginMaskAction.GETUSERS, onoff: true });
            }, 2000);
            sessionStorage.setItem('getusers', true);
        }
    }
}

export default connect((state, props) => {
    return {
        loginOnoff: state.loginOnoff,
        loaderOnoff: state.loaderOnoff,
        active: getActive(props.params.operation),
        mask: state.loginMask,
        register: state.loginRegister,
        login: state.loginIndex
    }
})(Loader);