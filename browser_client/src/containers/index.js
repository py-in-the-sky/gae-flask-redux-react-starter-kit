import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import store from '../store';
import PageOneApp from './PageOneApp';
import PageTwoApp from './PageTwoApp';
import Layout from '../components/Layout';
import { on, off } from 'material-ui/lib/utils/events';
import { debounce } from '../utils/lodash';
import { getWindowWidth } from '../utils/dom';
import { windowSize } from '../utils/styles';


export default class Root extends PureComponent {
    constructor(props) {
        super(props);
        this.renderReduxProvider = this.renderReduxProvider.bind(this);
        this.updateWindowData    = this.updateWindowData.bind(this);
        if (__DEV__)
            this.state = { debugVisible: false };

        this.debouncedUpdateWindowData = debounce(
            this.updateWindowData,
            this.props.debounceTime,
            { leading: false, trailing: true, maxWait: this.props.debounceTime * 2 }
        );
    }

    updateWindowData () {
        const windowWidth = getWindowWidth();
        this.setState({ windowWidth, windowSize: windowSize(windowWidth) });
    }

    componentWillMount () {
        on(window, 'resize', this.debouncedUpdateWindowData);
        // now that we're listening to the window-resize event,
        // for correctness, we set the current window
        // width to give the app the correct baseline
        this.updateWindowData();
    }

    componentWillUnmount () {
        off(window, 'resize', this.debouncedUpdateWindowData);
    }

    getChildContext () {
        return {
            windowWidth: this.state.windowWidth,
            windowSize:  this.state.windowSize,
        };
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
                <Router history={this.props.history}>
                    <Route path="/" component={Layout}>
                        <Route path="/1" component={PageOneApp} />
                        <Route path="/2" component={PageTwoApp} />
                    </Route>
                </Router>
            </Provider>
        );
    }
}


Root.propTypes = {
    history:      PropTypes.object.isRequired,
    debounceTime: PropTypes.number.isRequired,
};


Root.defaultProps = {
    debounceTime: 350,
};


Root.childContextTypes = {
    windowWidth: PropTypes.number.isRequired,
    windowSize:  PropTypes.number.isRequired,
};
