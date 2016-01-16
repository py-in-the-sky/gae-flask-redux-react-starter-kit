import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, Redirect } from 'react-router';
import store from '../store';
import HomeApp from './HomeApp';
import ShireApp from './ShireApp';
import MordorApp from './MordorApp';
import WindowResizeListener from './WindowResizeListener';
import CriticalErrorAlert from './CriticalErrorAlert';
import { Layout } from '../components';


export default class Root extends PureComponent {
    constructor(props) {
        super(props);

        this.renderReduxProvider = this.renderReduxProvider.bind(this);

        if (__DEV__)
            this.state = { debugVisible: false };
    }

    getChildContext () {
        return { history: this.props.history };
    }

    render() {
        if (__DEV__) {
            const { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');
            const toggleButtonStyle = {
                backgroundColor: '#2A2F3A',
                color: '#6FB3D2',
                position: 'fixed',
                bottom: 0,
                left: 0
            };

            return (
                <div>

                    {this.renderReduxProvider()}

                    <DebugPanel right bottom top={this.state.debugVisible}>
                        <DevTools store={store} monitor={LogMonitor} />
                    </DebugPanel>

                    <button
                     onClick={() => { this.setState({ debugVisible: !this.state.debugVisible }); } }
                     style={toggleButtonStyle}>
                        HIDE/SHOW REDUX DEBUG PANEL
                    </button>

                </div>
            );
        }
        else
            return this.renderReduxProvider();
    }

    renderReduxProvider () {
        return (
            <Provider store={store}>
                <div>
                    <WindowResizeListener />
                    <CriticalErrorAlert />
                    <Router history={this.props.history}>
                        <Route path="/" component={Layout}>
                            <IndexRoute component={HomeApp} />
                            <Route path="/shire" component={ShireApp} />
                            <Route path="/mordor" component={MordorApp} />
                        </Route>
                        <Redirect from="*" to="/" />
                    </Router>
                </div>
            </Provider>
        );
    }
}


Root.propTypes = {
    history: PropTypes.object.isRequired,
};


Root.childContextTypes = {
    history: PropTypes.object.isRequired,
}
