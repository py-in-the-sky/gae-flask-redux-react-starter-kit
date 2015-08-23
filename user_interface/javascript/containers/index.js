import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import store from '../store';
import PageOne from './page_one';
import PageTwo from './page_two';


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
            var toggleButtonStyle = {
                backgroundColor: '#2A2F3A',
                color: '#6FB3D2',
                position: 'fixed',
                bottom: 0,
                left: 0
            };

            return (
                <div>

                    {this.createReduxProvider()}

                    <DebugPanel top right bottom={this.state.debugVisible}>
                        <DevTools store={store} monitor={LogMonitor} />
                    </DebugPanel>

                    <button
                     onTouchTap={() => { this.setState({ debugVisible: !this.state.debugVisible }) } }
                     style={toggleButtonStyle}>
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
                {() =>
                    <Router history={this.props.history}>
                        <Route path='/'  component={PageOne} />
                        <Route path='/2' component={PageTwo} />
                    </Router>
                }
            </Provider>
        );
    }
}


Root.propTypes = {
    history: PropTypes.object.isRequired,
}
