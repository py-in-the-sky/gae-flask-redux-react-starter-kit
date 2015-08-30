import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as reducers from '../reducers';


function createStoreWithMiddleware () {
    const reducer = combineReducers(reducers);

    if (__DEV__) {
        const reduxDev = require('redux-devtools');

        const finalCreateStore = compose(
            reduxDev.devTools(),
            reduxDev.persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
            createStore
        );

        return applyMiddleware(thunkMiddleware)(finalCreateStore)(reducer);
    }
    else
        return applyMiddleware(thunkMiddleware)(createStore)(reducer);
}


export default createStoreWithMiddleware();
