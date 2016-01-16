import { handleActions } from 'redux-actions';
import { List, Set } from 'immutable';
import { getWindowWidth } from '../utils/dom';
import * as Styles from '../utils/styles';
import { ActionTypes as T } from '../actions';


const emptyList = List();
const emptySet  = Set();
const initialWindowWidth = getWindowWidth();
const initialWindowSize  = Styles.windowSize(initialWindowWidth);


export const names = handleActions({
    [T.ADD_NAME_DONE]:      (state, { payload }) => state.push(payload),
    [T.SUBTRACT_LAST_NAME]: state => state.pop(),
}, emptyList);


export const pendingRequests = handleActions({
    [T.ADD_NAME]:      (state, { meta }) => state.add(meta.requestId),
    [T.ADD_NAME_DONE]: (state, { meta }) => state.delete(meta.requestId),
}, emptySet);


export const windowWidth = handleActions({
    [T.WINDOW_DATA]: (_, { payload }) => payload.windowWidth,
}, initialWindowWidth);


export const windowSize = handleActions({
    [T.WINDOW_DATA]: (_, { payload }) => payload.windowSize,
}, initialWindowSize);
