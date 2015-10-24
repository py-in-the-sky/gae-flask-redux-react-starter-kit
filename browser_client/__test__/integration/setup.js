import Root from '../../src/containers';
import React from 'react';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import { renderIntoDocument } from 'react-addons-test-utils';
import { createFinder } from '../utils';
import { VelocityTransitionGroup } from 'velocity-react';
import sinonChai from 'sinon-chai';


before(function () {  // GLOBAL BEFORE
    VelocityTransitionGroup.disabledForTest = true;
    chai.use(sinonChai);
});


beforeEach(function () {  // BEFORE EACH TEST
    this.appHistory = new BrowserHistory();
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
