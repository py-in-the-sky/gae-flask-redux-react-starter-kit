import { ADD_NAME, SUBTRACT_LAST_NAME, WINDOW_WIDTH } from '../actions';
import { List, Set } from 'immutable';
import { throttledGetWindowWidth } from '../utils/dom';


const emptyList = List();
const emptySet  = Set();
const initialWindowWidth = throttledGetWindowWidth();


export function names (state = emptyList, action) {
    const { type, payload, error, meta } = action;
    const success = !error && meta && meta.complete;
    // the interface for telling whether an action represents a
    // success, error, or in-progress state should be simpler
    // and more self-describing
    if (type === ADD_NAME && success)
        return state.push(payload);
    else if (type === SUBTRACT_LAST_NAME)
        return state.pop();
    else
        return state;
}


export function pendingRequests (state = emptySet, action) {
    const { type, error, meta } = action;
    const complete = meta && meta.complete;
    const requestId = meta && meta.requestId;
    const addName = type === ADD_NAME;

    if (addName && complete && requestId)
        return state.delete(requestId);
    else if (addName && !error && !complete && requestId)
        return state.add(requestId);
    else
        return state;
}


export function windowWidth (state = initialWindowWidth, action) {
    const { type, payload } = action;

    if (type === WINDOW_WIDTH)
        return payload;
    else
        return state;
}
