import 'velocity-react';
// activate Velocity context, and...
import 'velocity-animate/velocity.ui';
// ...make Velocity UI Pack available to Velocity and velocity-react

import Root from './containers';
import React from 'react';
import ReactDOM from 'react-dom';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import $ from 'jquery';


$(document).ready(() => {
    if (__DEV__)
        require('./utils/dev_ajax_debug_utils')();

    const mountPoint = document.getElementById('user-interface');
    ReactDOM.render(<Root history={new BrowserHistory()} />, mountPoint);
});
