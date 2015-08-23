import Root from './containers';
import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';


injectTapEventPlugin();


if (__DEV__) {
    var devAjaxDebugUtils = require('./utils/dev_ajax_debug_utils');
    devAjaxDebugUtils.initializeAjaxDebuggingUtils();
}


function renderUserInterface () {
  let mountPoint = document.getElementById('user-interface');
  React.render(<Root />, mountPoint);
}


$(document).ready(renderUserInterface);
