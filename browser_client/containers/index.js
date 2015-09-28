import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import store from '../store';
import PageOneApp from './page_one_app';
import PageTwoApp from './page_two_app';
import Layout from '../components/layout';


export default class Root extends PureComponent {
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

                    {this.createReduxProvider()}

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
            return this.createReduxProvider();
    }

    createReduxProvider () {
        return (
            <Provider store={store}>
                {() =>
                    <Router history={this.props.history}>
                        <Route path="/" component={Layout}>
                            <Route path='/1' component={PageOneApp} />
                            <Route path='/2' component={PageTwoApp} />
                        </Route>
                    </Router>
                }
            </Provider>
        );
    }
}


Root.propTypes = {
    history: PropTypes.object.isRequired,
};
