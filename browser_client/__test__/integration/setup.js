import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';


/* eslint-disable no-console */


chai.use(sinonChai);


const log = process.env.HONCHO === 'true' ? ( () => null ) : console.log;


log('\n--- MOCHA SETUP START ---');


// require('velocity-animate').mock = true;
// // require Velocity only after window/DOM context is created
// log('turned off Velocity animations with `Velocity.mock = true`');


require('velocity-react').VelocityTransitionGroup.disabledForTest = true;
log('turned off VelocityTransitionGroup with ' +
    '`VelocityTransitionGroup.disabledForTest = true`');


if (GLOBAL.expect === undefined) {
    GLOBAL.expect = chai.expect;
    log('`expect` set as a GLOBAL');
}
else
    log('`GLOBAL.expect` already taken');


if (GLOBAL.sinon === undefined) {
    GLOBAL.sinon = sinon;
    log('`sinon` set as a GLOBAL');
}
else
    log('`GLOBAL.sinon` already taken');


if (GLOBAL.__DEV__ === undefined) {
    GLOBAL.__DEV__ = false;
    log('`__DEV__ = false` set as a GLOBAL');
}
else
    log('`GLOBAL.__DEV__` already taken');


log('--- MOCHA SETUP END ---\n');
