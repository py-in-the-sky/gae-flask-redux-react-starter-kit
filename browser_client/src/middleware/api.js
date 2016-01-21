import fetchMiddleware from './fetch';
import { ActionTypes as T } from '../actions';


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


export const onFetchFail = (body, response, fetchCall, _action, dispatch) => {
    if (response.status >= 500) {
        if (__DEV__) {
            require('../utils/devFetchDebug')(body, response.url, fetchCall);
        }

        dispatch({ type: T.SERVER_ERROR });

        return [ undefined, response ];
    }
    else {  // 400-level HTTP status
        return [ body, response ];
    }
};


export const onNetworkError = (_error, _fetchCall, _action, dispatch) => {
    dispatch({ type: T.NETWORK_ERROR });
    return [];
}



export default fetchMiddleware({
    key: API_CALL,
    beforeFetch,
    onFetchFail,
    onNetworkError,
});
