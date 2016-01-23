import uniqueId from 'lodash/utility/uniqueId';
import memoize  from 'lodash/function/memoize';
import isPlainObject from 'lodash/lang/isPlainObject';
import debounce from 'lodash/function/debounce';


const defaultExport = {
    uniqueId,
    memoize,
    isPlainObject,
    debounce,
};


const makeExport = () => {
    if (__TEST__) {
        // Using a copy of lodash that's run in the `window` context
        // allows us to make use of sinon's fake time and control functions
        // whose timing is regulated by certain lodash functions, such as
        // `debounce` and `throttle`.
        const lodash = require('lodash').runInContext(window);
        return Object.keys(defaultExport).reduce((obj, key) =>
            ({ ...obj, [key]: lodash[key] })
        , {});
    }
    else {
        return defaultExport;
    }
};


export default makeExport();
