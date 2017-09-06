import React, { Component } from 'react'

import Mask from '../components/Mask/Mask-box'

import Load from '../components/Mask/Load'

import { connect } from 'react-redux'

import { loaderInitAction } from '../store/loader/action'

import { history } from '../config'

class Loader extends Component {
    render() {
        return (
            <Mask setStyle="block">
                <Load />
            </Mask>
        )
    }
    componentDidUpdate() {
        const {loginOnoff, loaderOnoff} = this.props;
        if(!loaderOnoff) return;
        loginOnoff ? history.push('/app') : history.push('/login');
    }
    componentDidMount() {
        const {loginOnoff, loaderOnoff} = this.props;
        if(!loaderOnoff) return;
        loginOnoff ? history.push('/app') : history.push('/login');
    }
}

export default connect((state, porps) => {
    return {
        loginOnoff: state.loginOnoff,
        loaderOnoff: state.loaderOnoff
    }
})(Loader);