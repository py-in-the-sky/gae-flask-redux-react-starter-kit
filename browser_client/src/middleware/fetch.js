/*
    adapted from:
    https://github.com/rackt/redux/blob/master/examples/real-world/middleware/api.js
 */


import { isPlainObject } from '../utils/lodash';


export const FETCH = Symbol('fetch-middleware');


export default (opts = {}) => {
    validateOptions(opts);

    const beforeFetch    = opts.beforeFetch    || ( x => x );
    const onFetchDone    = opts.onFetchDone    || ( (...args) => args );
    const onFetchFail    = opts.onFetchFail    || ( (...args) => args );
    const onNetworkError = opts.onNetworkError || ( (...args) => args );

    return ({ dispatch, getState }) => next => action => {
        if (!isFetchCall(action)) return next(action);

        const fetchCall = beforeFetch(action.meta[FETCH], action, dispatch, getState);

        validateFetchCall(fetchCall);

        const { endpoint, done, fail, dispatchBaseAction, ...rest } = fetchCall;

        if (dispatchBaseAction !== false) next(action);

        const extraArgs = [ fetchCall, action, dispatch, getState ];

        return fetch(endpoint, rest)
            .then( response => {
                const bodyTransform = response.status < 500 ? response.json() : response.text();
                return bodyTransform.then( body => ({ response, body }) );
            })
            .then( ({ response, body }) =>
                response.ok
                    ? dispatch( done( ...onFetchDone(body, response, ...extraArgs) ) )
                    : dispatch( fail( ...onFetchFail(body, response, ...extraArgs) ) )
            )
            .catch( error => dispatch( fail( ...onNetworkError(error, ...extraArgs) ) ) );
    };
};


const isFetchCall = action =>
    isPlainObject(action) && isPlainObject(action.meta) && (FETCH in action.meta);


const OPTION_KEYS = [ 'beforeFetch', 'onFetchDone', 'onFetchFail', 'onNetworkError' ];


const validateOptions = opts => {
    if (!isPlainObject(opts))
        throw new Error('The argument to `fetchMiddleware` must be a plain ' +
                        'JavaScript object or left undefined.');

    OPTION_KEYS.forEach( fnName => {
        const fn = opts[fnName];

        if (typeof fn !== 'function' && typeof fn !== 'undefined')
            throw new Error(`\`${fnName}\` must be a function or left undefined.`);
    });
};


const validateFetchCall = fetchCall => {
    if (!isPlainObject(fetchCall))
        throw new Error('`action.meta[FETCH]` must be a plain JavaScript object.');

    if (typeof fetchCall.done !== 'function')
        throw new Error('`action.meta[FETCH].done` must be an action-creator function.');

    if (typeof fetchCall.fail !== 'function')
        throw new Error('`action.meta[FETCH].fail` must be an action-creator function.');
};
