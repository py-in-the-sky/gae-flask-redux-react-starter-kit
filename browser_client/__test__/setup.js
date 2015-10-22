/* eslint-disable no-console */

import chai from 'chai';
import { jsdom } from 'jsdom';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';


chai.use(sinonChai);



// You'll need to use this test helper on React components that use their
// own `setState` method.  From the Redux docs:
// "React seems to expect that, if you use `setState`, DOM is available.
// To work around the issue, we use jsdom so React doesn’t throw [an]
// exception when DOM isn’t available."
if (global.document === undefined) {
    global.document  = jsdom('<!doctype html><html><body></body></html>');
    global.window    = document.defaultView;
    global.navigator = { userAgent: 'node.js' };
}
else
    console.warn('`global.document` already taken');


// require Velocity only after window/DOM context is created
// require('velocity-animate').mock = true;
require('velocity-react').VelocityTransitionGroup.disabledForTest = true;


if (global.expect === undefined) global.expect = chai.expect;
else console.warn('`global.expect` already taken');


if (global.sinon === undefined) global.sinon = sinon;
else console.warn('`global.sinon` already taken');


if (global.__DEV__ === undefined) global.__DEV__ = false;
else console.warn('`global.__DEV__` already taken');
