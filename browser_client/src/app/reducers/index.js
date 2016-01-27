import * as _Reducers from './reducers';


let Reducers;
if (__TEST__) {
    const { deepFreezeFunctions } = require('app/utils/deepFreeze');
    Reducers = deepFreezeFunctions(_Reducers);
}
else {
    Reducers = _Reducers;
}


export default Reducers;
