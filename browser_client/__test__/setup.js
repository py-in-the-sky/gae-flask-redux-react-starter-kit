import expect from 'expect';
import { jsdom } from 'jsdom';
// import { VelocityTransitionGroup } from 'velocity-react';


/* eslint-disable no-console */


const log = process.env.HONCHO === 'true' ? ( () => null ) : console.log;


log('\n--- MOCHA SETUP START ---');


// VelocityTransitionGroup.disabledForTest = true;
// log('`VelocityTransitionGroup.disabledForTest = true`');


// You'll need to use this test helper on React components that use their
// own `setState` method.  From the Redux docs:
// "React seems to expect that, if you use `setState`, DOM is available.
// To work around the issue, we use jsdom so React doesn’t throw [an]
// exception when DOM isn’t available."
if (GLOBAL.document === undefined) {
    GLOBAL.document  = jsdom('<!doctype html><html><body></body></html>');
    GLOBAL.window    = document.defaultView;
    GLOBAL.navigator = { userAgent: 'node.js' };
    log('`jsdom` instance created for testing React components');
}
else
    log('`GLOBAL.document` already taken');


if (GLOBAL.expect === undefined) {
    GLOBAL.expect = expect;
    log('`expect` set as a GLOBAL');
}
else
    log('`GLOBAL.expect` already taken');


if (GLOBAL.__DEV__ === undefined) {
    GLOBAL.__DEV__ = false;
    log('`__DEV__ = false` set as a GLOBAL');
}
else
    log('`GLOBAL.__DEV__` already taken');


log('--- MOCHA SETUP END ---\n');
