/* eslint-disable prefer-arrow-callback */

import Root from '../../src/containers';
import React from 'react';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { renderIntoDocument } from 'react-addons-test-utils';
import { createFinder } from '../utils';


import '../setup';


beforeEach(function () {  // BEFORE EACH TEST
    this.appHistory = new createBrowserHistory();
    this.appRoot = renderIntoDocument(<Root history={this.appHistory} />);
    this.findOnPage = createFinder(this.appRoot);
    this.navigate = path => this.appHistory.pushState(null, path);
});


afterEach(function () {  // AFTER EACH TEST
    // erase app's browsing history so it doesn't leak into next test
    this.appHistory.replaceState(null, '/');
});


// after(function () {  // GLOBAL AFTER
// });
