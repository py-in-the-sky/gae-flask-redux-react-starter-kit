import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory'
import * as reducers from '../reducers';


function createStoreWithMiddleware () {
    if (__DEV__) {
        const logSlowReducers = require('../utils/devLogSlowReducers');
        const reducer = combineReducers(logSlowReducers(reducers));

        const { devTools, persistState } = require('redux-devtools');

        const finalCreateStore = compose(
            applyMiddleware(thunkMiddleware),
            reduxReactRouter({ createHistory }),
            devTools(),
            persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
        )(createStore);

        const store = finalCreateStore(reducer);

        // Enable Webpack hot module replacement for reducers
        if (module.hot)
            module.hot.accept('../reducers', () => {
                const nextRootReducer = combineReducers(
                    logSlowReducers(require('../reducers/index'))
                );
                store.replaceReducer(nextRootReducer);
            });

        return store;
    }
    else {
        const reducer = combineReducers(reducers);
        return compose(
            applyMiddleware(thunkMiddleware),
            reduxReactRouter({ createHistory })
        )(createStore)(reducer);
    }
}


export default createStoreWithMiddleware();
