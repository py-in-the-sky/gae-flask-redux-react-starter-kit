// import $ from 'jquery';
import { uniqueId } from '../utils/lodash';
import { wrappedSetTimeout } from '../utils/time';
// uniqueId could be used to help indicate to the reducers
// when a particular optimistic update has finished:
// the optimistic update and the real update will share
// the same unique ID, which is information that can
// help to coordinate a loading animation on the UI



export function fetchAndAddName (delay = 300) {
    return dispatch => {
        const requestId = uniqueId();

        dispatch(addName(null, { requestId }));

        const complete = true;

        const completeDispatch = () => {
            dispatch(addName('World', { requestId, complete }));
        };

        return wrappedSetTimeout(completeDispatch, delay);

        // return $.get('endpoint')
        //         .done(name => dispatch(addName(name)));
                // .fail()
    };
}


export const ADD_NAME = 'ADD_NAME';
function addName (name, meta, error) {
    return {
        type:    ADD_NAME,
        payload: error || name,
        error:   Boolean(error),
        meta:    meta
    };
}


export const SUBTRACT_LAST_NAME = 'SUBTRACT_LAST_NAME';
export function subtractLastName () {
    return {
        type: SUBTRACT_LAST_NAME
    };
}


export const WINDOW_WIDTH = 'WINDOW_WIDTH';
export function windowWidth (width) {
    return {
        type:    WINDOW_WIDTH,
        payload: width,
    };
}
