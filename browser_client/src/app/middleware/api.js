import fetchMiddleware from './fetch';
import { ActionTypes as T } from 'app/actions';


export const API_CALL = Symbol('api-middleware');


let _beforeFetch = fetchCall => ({
    ...fetchCall,
    credentials: 'same-origin',
    headers: {
        ...(fetchCall.headers || {}),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: fetchCall.body ? JSON.stringify(fetchCall.body) : undefined,
});


let _onFetchFail = (body, response, fetchCall, _action, dispatch) => {
    if (response.status >= 500) {
        if (__DEV__) {
            require('app/utils/devFetchDebug')(body, response.url, fetchCall);
        }

        dispatch({ type: T.SERVER_ERROR });

        return [ undefined, response ];
    }
    else {  // 400-level HTTP status
        return [ body, response ];
    }
};


let _onNetworkError = (_error, _fetchCall, _action, dispatch) => {
    dispatch({ type: T.NETWORK_ERROR });
    return [];
};


if (__TEST__) {
    const { deepFreezeFunction } = require('app/utils/deepFreeze');
    _beforeFetch    = deepFreezeFunction(_beforeFetch);
    _onFetchFail    = deepFreezeFunction(_onFetchFail);
    _onNetworkError = deepFreezeFunction(_onNetworkError);
}


export const beforeFetch    = _beforeFetch;
export const onFetchFail    = _onFetchFail;
export const onNetworkError = _onNetworkError;


export default fetchMiddleware({
    key: API_CALL,
    beforeFetch,
    onFetchFail,
    onNetworkError,
});
