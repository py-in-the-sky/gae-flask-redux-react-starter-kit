import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as reducers from '../reducers';


function createStoreWithMiddleware () {
    const reducer = combineReducers(reducers);

    if (__DEV__) {
        const { devTools, persistState } = require('redux-devtools');

        const finalCreateStore = compose(
            devTools(),
            persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
            createStore
        );

        return applyMiddleware(thunkMiddleware)(finalCreateStore)(reducer);
    }
    else
        return applyMiddleware(thunkMiddleware)(createStore)(reducer);
}


export default createStoreWithMiddleware();
