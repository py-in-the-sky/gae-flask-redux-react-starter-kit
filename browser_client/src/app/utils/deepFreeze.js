import _deepFreeze from 'deep-freeze-node';


export const deepFreeze = _deepFreeze;


export const deepFreezeFunction = fn => (...args) =>
    deepFreeze( fn( ...deepFreeze(args) ) );


export const deepFreezeFunctions = fns =>
    Object.keys(fns).reduce( (frozenFns, key) => {
        const obj = fns[key];

        frozenFns[key] = typeof obj === 'function'
            ? deepFreezeFunction(obj)
            : obj;

        return frozenFns;
    }, {});
