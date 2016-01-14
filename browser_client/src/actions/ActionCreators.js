import { createAction } from 'redux-actions';
import T from './ActionTypes';
import { FETCH } from '../middleware/fetch';
import { uniqueId } from '../utils/lodash';
// uniqueId could be used to help indicate to the reducers
// when a particular optimistic update has finished:
// the optimistic update and the real update will share
// the same unique ID, which is information that can
// help to coordinate a loading animation on the UI


export const windowData       = createAction(T.WINDOW_DATA);
export const subtractLastName = createAction(T.SUBTRACT_LAST_NAME);


export const addName = createAction(
    T.ADD_NAME,

    undefined,

    name => {
        const requestId = uniqueId('addName');

        const fetchCall = {
            endpoint: ,  // TODO
            method: name ? 'POST'   : 'GET',
            body:   name ? { name } : undefined,
            done: ,  // TODO
            fail: ,  // TODO
        };

        return {
            requestId,
            [FETCH]: fetchCall,
        };
    }
);


export const addNameDone = createAction(
    T.ADD_NAME_DONE,
    (name, _) => name,
    (_, requestId) => requestId
);


export const addNameFail = createAction(
    T.ADD_NAME_FAIL,
    (name, _) => name,
    (_, requestId) => requestId
);
