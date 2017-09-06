import { createStore, applyMiddleware, combineReducers } from 'redux'

import thunkMiddleware from 'redux-thunk'

import * as loader from './loader'

import * as login from './login'

import * as app from './app'

const obj = {
    ...loader,
    ...login,
    ...app
}

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

const reducers = combineReducers(obj);

export default function () {
    return createStoreWithMiddleware(reducers);
}