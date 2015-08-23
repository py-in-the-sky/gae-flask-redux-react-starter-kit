import { ADD_NAME, SUBTRACT_LAST_NAME } from '../actions';
import { List, Set } from 'immutable';


let emptyList = List();
let emptySet  = Set();


export function names (state = emptyList, action) {
    const { type, payload, meta } = action;
    const complete = meta && meta.complete;

    if (type === ADD_NAME && complete)
        return state.push(payload);
    else if (type === SUBTRACT_LAST_NAME)
        return state.pop();
    else
        return state;
}


export function pendingRequests (state = emptySet, action) {
    const { error, meta } = action;
    const complete = meta && meta.complete;
    const requestId = meta && meta.requestId;

    if (complete && requestId)
        return state.delete(requestId);
    else if (!error && !complete && requestId)
        return state.add(requestId);
    else
        return state;
}
