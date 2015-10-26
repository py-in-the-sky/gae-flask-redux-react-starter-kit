import 'velocity-react';
// activate Velocity context, and...
import 'velocity-animate/velocity.ui';
// ...make Velocity UI Pack available to Velocity and velocity-react


import Root from './src/containers';
import React from 'react';
import ReactDOM from 'react-dom';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import $ from 'jquery';
import injectTapEventPlugin from 'react-tap-event-plugin';


$(document).ready(() => {
    if (__DEV__)
        require('./src/utils/devAjaxDebug')();

    //Needed for onTouchTap
    //Can go away when react 1.0 release
    //Check this repo:
    //https://github.com/zilverline/react-tap-event-plugin
    injectTapEventPlugin();

    const mountPoint = document.getElementById('user-interface');
    ReactDOM.render(<Root history={new BrowserHistory()} />, mountPoint);
});
