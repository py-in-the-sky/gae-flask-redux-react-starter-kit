import { handleActions } from 'redux-actions'
import { List, Set } from 'immutable'
import { getWindowWidth } from 'app/utils/dom'
import * as Styles from 'app/utils/styles'
import { ActionTypes as T } from 'app/actions'


const emptyList   = List()
const emptySet    = Set()
const emptyObject = {}
const initialWindowWidth = getWindowWidth()
const initialWindowSize  = Styles.windowSize(initialWindowWidth)


export const names = handleActions({
    [T.ADD_NAME_DONE]:      (state, { payload }) => state.push(payload),
    [T.SUBTRACT_LAST_NAME]: state => state.pop(),
}, emptyList)


 export const serverValidation = handleActions({
    [T.ADD_NAME]:                () => emptyObject,
    [T.ADD_NAME_DONE]:           () => emptyObject,
    [T.ADD_NAME_FAIL]:           (_, { payload }) => payload || emptyObject,
    [T.CLEAR_SERVER_VALIDATION]: () => emptyObject,
}, emptyObject)


export const serverError = handleActions({
    [T.SERVER_ERROR]:       () => true,
    [T.CLEAR_SERVER_ERROR]: () => false,
}, false)


export const networkError = handleActions({
    [T.NETWORK_ERROR]:       () => true,
    [T.CLEAR_NETWORK_ERROR]: () => false,
}, false)


export const pendingRequests = handleActions({
    [T.ADD_NAME]:      (state, { meta }) => state.add(meta.requestId),
    [T.ADD_NAME_DONE]: (state, { meta }) => state.delete(meta.requestId),
    [T.ADD_NAME_FAIL]: (state, { meta }) => state.delete(meta.requestId),
}, emptySet)


export const windowWidth = handleActions({
    [T.WINDOW_DATA]: (_, { payload }) => payload.windowWidth,
}, initialWindowWidth)


export const windowSize = handleActions({
    [T.WINDOW_DATA]: (_, { payload }) => payload.windowSize,
}, initialWindowSize)


export const enteredPagePath = handleActions({
    [T.ENTERED_PAGE_PATH]: (_, { payload }) => payload,
}, null)
