/*
    flowtype primitive types:
    https://github.com/facebook/flow/tree/master/lib
    http://flowtype.org/docs/primitives.html
 */

declare type Action = {
    type:     string,
    payload?: mixed,
    meta?:    mixed,
    error?:   boolean,
};


declare type ActionCreator = (...x: []) => Action;
