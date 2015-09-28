import Root from './containers';
import React from 'react';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import $ from 'jquery';


if (__DEV__) {
    const initializeAjaxDebuggingUtils = require('./utils/dev_ajax_debug_utils');
    initializeAjaxDebuggingUtils();
}


function renderUserInterface () {
    const mountPoint = document.getElementById('user-interface');
    React.render(<Root history={new BrowserHistory()} />, mountPoint);
}


$(document).ready(renderUserInterface);
