import Root from './containers';
import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import $ from 'jquery';


injectTapEventPlugin();


if (__DEV__) {
    const devAjaxDebugUtils = require('./utils/dev_ajax_debug_utils');
    devAjaxDebugUtils.initializeAjaxDebuggingUtils();
}


function renderUserInterface () {
    const mountPoint = document.getElementById('user-interface');
    React.render(<Root history={new BrowserHistory()} />, mountPoint);
}


$(document).ready(renderUserInterface);
