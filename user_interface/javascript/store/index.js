import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as reducers from '../reducers';


function createStoreWithMiddleware () {
    const reducer = combineReducers(reducers);

    if (__DEV__) {
        const { devTools, persistState } = require('redux-devtools');

        const finalCreateStore = compose(
            applyMiddleware(thunkMiddleware),
            devTools(),
            persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
        )(createStore);

        const store = finalCreateStore(reducer);

        if (module.hot) {  // Enable Webpack hot module replacement for reducers
            module.hot.accept('../reducers', () => {
                const nextRootReducer = combineReducers(require('../reducers/index'));
                store.replaceReducer(nextRootReducer);
            });
        }

        return store;
    }
    else
        return applyMiddleware(thunkMiddleware)(createStore)(reducer);
}


export default createStoreWithMiddleware();
