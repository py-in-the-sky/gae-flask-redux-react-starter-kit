import expect from 'expect';
import { jsdom } from 'jsdom';


console.log('\n--- MOCHA SETUP START ---')


// You'll need to use this test helper on React components that use their
// own `setState` method.  From the Redux docs:
// "React seems to expect that, if you use `setState`, DOM is available.
// To work around the issue, we use jsdom so React doesn’t throw [an]
// exception when DOM isn’t available."
if (global.document === undefined) {
    global.document  = jsdom('<!doctype html><html><body></body></html>');
    global.window    = document.parentWindow;
    global.navigator = { userAgent: 'node.js' };
    console.log('`jsdom` instance created for testing React components')
}
else
    console.log('`global.document` already taken');


if (global.expect === undefined) {
    global.expect = expect;
    console.log('`expect` set as a global')
}
else
    console.log('`global.expect` already taken');


if (global.__DEV__ === undefined) {
    global.__DEV__ = false;
    console.log('`__DEV__ = false` set as a global')
}
else
    console.log('`global.__DEV__` already taken');


console.log('--- MOCHA SETUP END ---\n')
