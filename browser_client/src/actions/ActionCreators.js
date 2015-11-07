import { createAction } from 'redux-actions';
import T from './ActionTypes';
import { wrappedSetTimeout } from '../utils/time';
import { uniqueId } from '../utils/lodash';
// uniqueId could be used to help indicate to the reducers
// when a particular optimistic update has finished:
// the optimistic update and the real update will share
// the same unique ID, which is information that can
// help to coordinate a loading animation on the UI


export const windowData       = createAction(T.WINDOW_DATA);
export const subtractLastName = createAction(T.SUBTRACT_LAST_NAME);


export const addName = (name = 'World', delay = 300) =>
    dispatch => {
        const requestId = uniqueId();
        dispatch({ type: T.ADD_NAME, meta: requestId });
        return wrappedSetTimeout(
            () => dispatch(addNameDone(name, requestId)),
            delay
        );
    };


export const addNameDone = createAction(
    T.ADD_NAME_DONE,
    (name, _) => name,
    (_, requestId) => requestId
);
