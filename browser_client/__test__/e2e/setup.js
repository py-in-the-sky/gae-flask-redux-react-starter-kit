/* eslint-disable prefer-arrow-callback */

import Root from 'app/containers';
import store from 'app/store';
import React from 'react';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { renderIntoDocument } from 'react-addons-test-utils';
import { createFinder } from '../utils';


import '../setup';


beforeEach(function () {  // BEFORE EACH TEST
    this.timeout(5000);  // see https://mochajs.org/#timeouts
    this.appHistory = new createBrowserHistory();
    this.store = store;
    this.appRoot = renderIntoDocument(
        <Root history={this.appHistory} store={this.store} />
    );
    this.findOnPage = createFinder(this.appRoot);
    this.navigate = path => this.appHistory.pushState(null, path);
});


afterEach(function () {  // AFTER EACH TEST
    // erase app's browsing history so it doesn't leak into next test
    this.appHistory.replaceState(null, '/');
});


// after(function () {  // GLOBAL AFTER
// });
