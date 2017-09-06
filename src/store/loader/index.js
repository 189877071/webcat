import { LOADERINITACTION } from './action'

export function loaderOnoff(state=false, action) {
    switch(action.type) {
        case LOADERINITACTION:
            return true;
        default:
            return state;
    }
}

