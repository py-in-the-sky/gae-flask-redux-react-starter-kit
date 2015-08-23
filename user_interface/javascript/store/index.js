import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as reducers from '../reducers';


function createStoreWithMiddleware () {
    let reducer = combineReducers(reducers);

    if (__DEV__) {
        let reduxDev = require('redux-devtools');

        let finalCreateStore = compose(
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
