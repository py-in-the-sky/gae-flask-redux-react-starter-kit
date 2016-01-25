import { handleActions } from 'redux-actions';
import { List, Set, Record } from 'immutable';
import { getWindowWidth } from 'app/utils/dom';
import * as Styles from 'app/utils/styles';
import { ActionTypes as T } from 'app/actions';
import { isPlainObject } from 'app/utils/lodash';


const Name = Record({ name: undefined });
const emptyList = List();
const emptySet  = Set();
const initialWindowWidth = getWindowWidth();
const initialWindowSize  = Styles.windowSize(initialWindowWidth);


export const names = handleActions({
    [T.ADD_NAME_DONE]: (state, { payload }) => state.push(new Name(payload)),
    [T.SUBTRACT_LAST_NAME]: state => state.pop(),
}, emptyList);


export const serverValidation = handleActions({
    [T.ADD_NAME]:                () => null,
    [T.ADD_NAME_DONE]:           () => null,
    [T.CLEAR_SERVER_VALIDATION]: () => null,
    [T.ADD_NAME_FAIL]: (_, { payload }) =>
        isPlainObject(payload) && payload.message ? new Name(payload.message) : null,
}, null);


export const serverError = handleActions({
    [T.SERVER_ERROR]:       () => true,
    [T.CLEAR_SERVER_ERROR]: () => false,
}, false);


export const networkError = handleActions({
    [T.NETWORK_ERROR]:       () => true,
    [T.CLEAR_NETWORK_ERROR]: () => false,
}, false);


export const pendingRequests = handleActions({
    [T.ADD_NAME]:      (state, { meta }) => state.add(meta.requestId),
    [T.ADD_NAME_DONE]: (state, { meta }) => state.delete(meta.requestId),
    [T.ADD_NAME_FAIL]: (state, { meta }) => state.delete(meta.requestId),
}, emptySet);


export const windowWidth = handleActions({
    [T.WINDOW_DATA]: (_, { payload }) => payload.windowWidth,
}, initialWindowWidth);


export const windowSize = handleActions({
    [T.WINDOW_DATA]: (_, { payload }) => payload.windowSize,
}, initialWindowSize);
