import expect from 'expect';
import { jsdom } from 'jsdom';


console.log('\n--- MOCHA SETUP START ---')


// You'll need to use this test helper on React components that use their
// own `setState` method.  From the Redux docs:
// "React seems to expect that, if you use `setState`, DOM is available.
// To work around the issue, we use jsdom so React doesn’t throw [an]
// exception when DOM isn’t available."
if (GLOBAL.document === undefined) {
    GLOBAL.document  = jsdom('<!doctype html><html><body></body></html>');
    GLOBAL.window    = document.defaultView;
    GLOBAL.navigator = { userAgent: 'node.js' };
    console.log('`jsdom` instance created for testing React components')
}
else
    console.log('`GLOBAL.document` already taken');


if (GLOBAL.expect === undefined) {
    GLOBAL.expect = expect;
    console.log('`expect` set as a GLOBAL')
}
else
    console.log('`GLOBAL.expect` already taken');


if (GLOBAL.__DEV__ === undefined) {
    GLOBAL.__DEV__ = false;
    console.log('`__DEV__ = false` set as a GLOBAL')
}
else
    console.log('`GLOBAL.__DEV__` already taken');


console.log('--- MOCHA SETUP END ---\n')
