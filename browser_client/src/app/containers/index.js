import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, Redirect } from 'react-router'
import HomeApp from './HomeApp'
import ShireApp from './ShireApp'
import MordorApp from './MordorApp'
import WindowResizeListener from './WindowResizeListener'
import CriticalErrorAlert from './CriticalErrorAlert'
import LayoutApp from './LayoutApp'
import { HOME, SHIRE, MORDOR } from 'app/utils/Routes'


export default class Root extends Component {
    constructor (props) {
        super(props)

        this.renderReduxProvider = this.renderReduxProvider.bind(this)

        if (__DEV__) {
            this.state = { debugVisible: false }
            this.toggleDebugVisible = () => {
                this.setState({ debugVisible: !this.state.debugVisible })
            }
        }
    }

    getChildContext () {
        return { history: this.props.history }
    }

    render () {
        if (__DEV__) {
            const { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react')
            const toggleButtonStyle = {
                backgroundColor: '#2A2F3A',
                color: '#6FB3D2',
                position: 'fixed',
                bottom: 0,
                left: 0
            }

            return (
                <div>

                    {this.renderReduxProvider()}

                    <DebugPanel right bottom top={this.state.debugVisible}>
                        <DevTools store={this.props.store} monitor={LogMonitor} />
                    </DebugPanel>

                    <button
                     onClick={this.toggleDebugVisible}
                     style={toggleButtonStyle}>
                        HIDE/SHOW REDUX DEBUG PANEL
                    </button>

                </div>
            )
        } else {
            return this.renderReduxProvider()
        }
    }

    renderReduxProvider () {
        return (
            <Provider store={this.props.store}>
                <div>
                    <WindowResizeListener />
                    <CriticalErrorAlert />
                    <Router history={this.props.history}>
                        <Route path={HOME} component={LayoutApp}>
                            <IndexRoute component={HomeApp} />
                            <Route path={SHIRE}  component={ShireApp} />
                            <Route path={MORDOR} component={MordorApp} />
                        </Route>
                        <Redirect from="*" to={HOME} />
                    </Router>
                </div>
            </Provider>
        )
    }
}


Root.propTypes = {
    history: PropTypes.shape({
        pushState: PropTypes.func.isRequired,
    }).isRequired,
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
        subscribe: PropTypes.func.isRequired,
        getState: PropTypes.func.isRequired,
        replaceReducer: PropTypes.func.isRequired,
    }).isRequired,
}


Root.childContextTypes = {
    history: PropTypes.shape({
        pushState: PropTypes.func.isRequired,
    }).isRequired,
}
