import React from 'react';
import PureComponent from 'react-pure-render/component';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import store from '../store';
import WindowResizeListener from './WindowResizeListener';
import { Route, IndexRoute } from 'react-router';
import HomeApp from './HomeApp';
import ShireApp from './ShireApp';
import MordorApp from './MordorApp';
import { Layout } from '../components';


export default class Root extends PureComponent {
    constructor(props) {
        super(props);

        this.renderReduxProvider = this.renderReduxProvider.bind(this);

        if (__DEV__)
            this.state = { debugVisible: false };
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
                    <ReduxRouter>
                        <Route path="/" component={Layout}>
                            <IndexRoute component={HomeApp} />
                            <Route path="/shire" component={ShireApp} />
                            <Route path="/mordor" component={MordorApp} />
                        </Route>
                    </ReduxRouter>
                </div>
            </Provider>
        );
    }
}
