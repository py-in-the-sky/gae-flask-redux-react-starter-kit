import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import App from './app';


export default class Root extends Component {
    constructor(props) {
        super(props);
        this.createMainComponent = this.createMainComponent.bind(this);
        this.createReduxProvider = this.createReduxProvider.bind(this);
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

                    <DebugPanel top right bottom>
                        <DevTools store={store} monitor={LogMonitor} />
                    </DebugPanel>

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
