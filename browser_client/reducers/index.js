/* @flow */

import { ADD_NAME, SUBTRACT_LAST_NAME } from '../actions';
import { List, Set } from 'immutable';


type Action = {
    type:     string,
    payload?: mixed,
    meta?:    mixed,
    error?:   boolean
};


const emptyList = List();
const emptySet  = Set();


export function names (state: Object = emptyList, action: Action): Object {
    // $FlowIssue: https://github.com/facebook/flow/issues/844#issuecomment-142360400
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


export function pendingRequests (state: Object = emptySet, action: Action): Object {
    // $FlowIssue: https://github.com/facebook/flow/issues/844#issuecomment-142360400
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
