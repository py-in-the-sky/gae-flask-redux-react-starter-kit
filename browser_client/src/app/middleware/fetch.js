/*
    adapted from:
    https://github.com/rackt/redux/blob/master/examples/real-world/middleware/api.js
 */


import { isPlainObject } from 'app/utils/lodash'


export const FETCH = Symbol('fetch-middleware')


export default (opts = {}) => {
    validateOptions(opts)

    const fetchKey       = opts.key            || FETCH
    const beforeFetch    = opts.beforeFetch    || ( x => x )
    const onFetchDone    = opts.onFetchDone    || ( (...args) => args )
    const onFetchFail    = opts.onFetchFail    || ( (...args) => args )
    const onNetworkError = opts.onNetworkError || ( (...args) => args )

    return ({ dispatch, getState }) => next => action => {
        if (!isFetchCall(action, fetchKey)) return next(action)

        const fetchCall = beforeFetch(action.meta[fetchKey], action, dispatch, getState)

        validateFetchCall(fetchCall)

        const { endpoint, done, fail, dispatchBaseAction, ...rest } = fetchCall

        if (dispatchBaseAction !== false) next(action)

        const extraArgs = [ fetchCall, action, dispatch, getState ]

        return fetch(endpoint, rest)
            .then( response => {
                const bodyTransform = response.status < 500 ? response.json() : response.text()
                return bodyTransform.then( body => ({ response, body }) )
            })
            .then( ({ response, body }) =>
                response.ok
                    ? dispatch( done( ...onFetchDone(body, response, ...extraArgs) ) )
                    : dispatch( fail( ...onFetchFail(body, response, ...extraArgs) ) )
            )
            .catch( error => dispatch( fail( ...onNetworkError(error, ...extraArgs) ) ) )
    }
}


const isFetchCall = (action, fetchKey) =>
    isPlainObject(action) && isPlainObject(action.meta) && (fetchKey in action.meta)


const OPTION_KEYS = [ 'beforeFetch', 'onFetchDone', 'onFetchFail', 'onNetworkError' ]


const validateOptions = opts => {
    if (!isPlainObject(opts)) {
        throw new Error('The argument to `fetchMiddleware` must be a plain ' +
                        'JavaScript object or left undefined.')
    }

    if (typeof opts.key !== 'symbol' && typeof opts.key !== 'undefined') {
        throw new Error('`key` must be a symbol or left undefined.')
    }

    OPTION_KEYS.forEach( fnName => {
        const fn = opts[fnName]

        if (typeof fn !== 'function' && typeof fn !== 'undefined') {
            throw new Error(`\`${fnName}\` must be a function or left undefined.`)
        }
    })
}


const validateFetchCall = fetchCall => {
    if (!isPlainObject(fetchCall)) {
        throw new Error('`action.meta[<fetch key>]` must be a plain JavaScript object.')
    } else if (typeof fetchCall.done !== 'function') {
        throw new Error('`action.meta[<fetch key>].done` must be an action-creator function.')
    } else if (typeof fetchCall.fail !== 'function') {
        throw new Error('`action.meta[<fetch key>].fail` must be an action-creator function.')
    }
}
