export default function devLogFunctionCalls (fn) {
    if (__DEV__)
        return (...args) => {
            const returnValue = fn(...args);
            console.log(`${fn.name}(${args.join(', ')}) ->`, returnValue);
            return returnValue;
        };

    return fn;
};
