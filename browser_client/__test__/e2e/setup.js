/* eslint-disable prefer-arrow-callback */


import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import { replaceState } from 'redux-router';
import { createFinder } from '../utils';
import Root from '../../src/containers';
import store from '../../src/store';
import { ActionCreators } from '../../src/actions';


import '../setup';


const { navigate } = ActionCreators;
const { dispatch } = store;


beforeEach(function () {  // BEFORE EACH TEST
    this.appRoot = renderIntoDocument(<Root />);
    this.findOnPage = createFinder(this.appRoot);
    this.navigate = path => dispatch(navigate(path));
    this.resetBrowserHistory = () => dispatch(replaceState(undefined, '/'));
});


afterEach(function () {  // AFTER EACH TEST
    // erase app's browsing history so it doesn't leak into next test
    this.resetBrowserHistory();
});


// after(function () {  // GLOBAL AFTER
// });
