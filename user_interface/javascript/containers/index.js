import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import App from './app';


export default class Root extends Component {
    constructor(props) {
        super(props);
        this.createMainComponent = this.createMainComponent.bind(this);
        this.createReduxProvider = this.createReduxProvider.bind(this);
        if (__DEV__)
            this.state = { debugVisible: true };
    }

    render() {
        return this.createMainComponent();
    }

    createMainComponent () {
        if (__DEV__) {
            var reduxDev = require('redux-devtools/lib/react');
            var DevTools = reduxDev.DevTools;
            var DebugPanel = reduxDev.DebugPanel;
            var LogMonitor = reduxDev.LogMonitor;

            return (
                <div>

                    {this.createReduxProvider()}

                    <DebugPanel top right bottom={this.state.debugVisible}>
                        <DevTools store={store} monitor={LogMonitor} />
                    </DebugPanel>

                    <button
                     onTouchTap={() => { this.setState({ debugVisible: !this.state.debugVisible }) } }
                     style={{ position: 'fixed', bottom: 0, left: 0 }}>
                        HIDE/SHOW REDUX DEBUG PANEL
                    </button>

                </div>
            );
        }
        else
            return this.createReduxProvider();
    }

    createReduxProvider () {
        return (
            <Provider store={store}>
                {() => <App />}
            </Provider>
        );
    }
}
