/*
    adapted from:
    https://github.com/rackt/redux/blob/master/examples/real-world/middleware/api.js
 */

import isPlainObject from 'lodash.isplainobject';


export const FETCH = Symbol('fetch-middleware');


export default const fetchMiddleware = (opts = {}) => {

    validateOptions(opts);

    const beforeFetch = opts.beforeFetch || ( x => x );
    const onFetchDone = opts.onFetchDone || ( (...args) => args );
    const onFetchFail = opts.onFetchFail || ( (...args) => args );

    return ({ dispatch }) => next => action => {
        if (!isFetchCall(action))
            return next(action);

        const fetchCall = beforeFetch(action.meta[FETCH], action);

        if (!isPlainObject(fetchCall))
            throw new Error('`action.meta[FETCH]` must be a plain JavaScript object.');

        const { done, fail, dispatchBaseAction } = fetchCall;

        if (dispatchBaseAction !== false)
            next(action);

        return callApi(fetchCall).then(
            response => dispatch(
                done( ...onFetchDone(response, fetchCall, action) )
            ),
            error => dispatch(
                fail( ...onFetchFail(error, fetchCall, action) )
            )
        );
    };
};


const isFetchCall = action =>
    isPlainObject(action) && isPlainObject(action.meta) && (FETCH in action.meta);


const callApi = ({ path }) =>
    fetch(path)
        .then( response => response.json().then( json => ({ json, response }) ) )
        .then( ({ json, response }) => response.ok ? json : Promise.reject(json) );


const optionsKeys = [ 'beforeFetch', 'onFetchDone', 'onFetchFail' ];


const validateOptions = opts => {
    if (typeof opts === 'undefined')
        return;

    if (!isPlainObject(opts))
        throw new Error('The argument to `fetchMiddleware` must be a plain ' +
                        ' JavaScript or left undefined.');

    optionsKeys.forEach( fnName => {
        const fn = opts[fnName];

        if (typeof fn !== 'function' && typeof fn !== 'undefined')
            throw new Error(`\`${fnName}\` must be a function or left undefined.`);
        });
};
