import ActionTypes from './ActionTypes';
import * as _ActionCreators from './ActionCreators';


let ActionCreators;
if (__TEST__) {
    const { deepFreezeFunctions } = require('app/utils/deepFreeze');
    ActionCreators = deepFreezeFunctions(_ActionCreators);
}
else {
    ActionCreators = _ActionCreators;
}


export default {
    ActionTypes,
    ActionCreators,
};
