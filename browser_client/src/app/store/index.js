import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import * as reducers from 'app/reducers'


export const createStoreWithMiddleware = () => {
    const middleware = applyMiddleware(thunkMiddleware)

    if (__DEV__) {
        const logSlowReducers = require('app/utils/devLogSlowReducers')
        const reducer = combineReducers(logSlowReducers(reducers))

        const {
            devTools,
            // persistState
        } = require('redux-devtools')

        const finalCreateStore = compose(
            middleware,
            devTools()
            // persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
        )(createStore)

        const store = finalCreateStore(reducer)

        if (module.hot) {  // Enable Webpack hot module replacement for reducers
            module.hot.accept('app/reducers', () => {
                const nextRootReducer = combineReducers(
                    logSlowReducers(require('app/reducers/index'))
                )
                store.replaceReducer(nextRootReducer)
            })
        }

        return store
    } else {
        const reducer = combineReducers(reducers)
        return middleware(createStore)(reducer)
    }
}


export default createStoreWithMiddleware()
