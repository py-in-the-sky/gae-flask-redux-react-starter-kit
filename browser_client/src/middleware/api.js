import fetchMiddleware from './fetch';
import { ActionTypes } from '../actions';


const { SERVER_ERROR, NETWORK_ERROR } = ActionTypes;


export const API_CALL = Symbol('api-middleware');


export const beforeFetch = fetchCall => ({
    ...fetchCall,
    credentials: 'same-origin',
    headers: {
        ...(fetchCall.headers || {}),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: fetchCall.body ? JSON.stringify(fetchCall.body) : undefined,
});


export const onFetchFail = (body, response, _fetchCall, _action, dispatch) => {
    if (response.status >= 500) {
        if (__DEV__) {
            require('../utils/devFetchDebug')(body, response.url);
        }

        dispatch({ type: SERVER_ERROR });
        // TODO: this action should result in the user being told
        // "Could not connect to server.  Please try again."

        return [ undefined, response ];
    }
    else {  // 400-level HTTP status
        return [ body, response ];
    }
};


export const onNetworkError = (_error, _fetchCall, _action, dispatch) => {
    dispatch({ type: NETWORK_ERROR });
    // TODO: this action should result in the user being told
    // "Cannot connect to the internet.  Please try again."

    return [];
}



export default fetchMiddleware({
    key: API_CALL,
    beforeFetch,
    onFetchFail,
    onNetworkError,
});
