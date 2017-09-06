import './public/css/common.scss'

import './common'

import React from 'react'

import { render } from 'react-dom'

import { Router } from 'react-router'

import { Provider } from 'react-redux'

import storeConfig from './store'

import routes from './router'

import { history } from './config'

import socket from './socket'

const store = storeConfig();

socket(store);

history.push('/');

render(
    <Provider store={store}>
        <Router history={history} routes={routes}></Router>
    </Provider>,
    document.querySelector('#app')
)