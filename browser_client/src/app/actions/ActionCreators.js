import { createAction } from 'redux-actions'
import T from './ActionTypes'
import { API_CALL } from 'app/middleware/api'
import { uniqueId } from 'app/utils/lodash'
// uniqueId could be used to help indicate to the reducers
// when a particular optimistic update has finished:
// the optimistic update and the real update will share
// the same unique ID, which is information that can
// help to coordinate a loading animation on the UI


export const windowData            = createAction(T.WINDOW_DATA)
export const subtractLastName      = createAction(T.SUBTRACT_LAST_NAME)
export const clearServerError      = createAction(T.CLEAR_SERVER_ERROR)
export const clearNetworkError     = createAction(T.CLEAR_NETWORK_ERROR)
export const clearServerValidation = createAction(T.CLEAR_SERVER_VALIDATION)


export const addName = createAction(
    T.ADD_NAME,

    undefined,

    ({ name }) => {
        const requestId = uniqueId('addName')

        const fetchCall = {
            endpoint: '/api/v1/names/',
            method: name ? 'POST'   : 'GET',
            body:   name ? { name } : undefined,
            done: responseBody => addNameDone(responseBody, requestId),
            fail: responseBody => addNameFail(responseBody, requestId),
        }

        return {
            requestId,
            [API_CALL]: fetchCall,
        }
    }
)


export const addNameDone = createAction(
    T.ADD_NAME_DONE,
    (responseBody) => responseBody,
    (_, requestId) => ({ requestId })
)


export const addNameFail = createAction(
    T.ADD_NAME_FAIL,
    (responseBody) => responseBody,
    (_, requestId) => ({ requestId })
)
