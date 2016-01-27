/* eslint-disable prefer-arrow-callback */


import { VelocityTransitionGroup } from 'velocity-react';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import injectTapEventPlugin from 'react-tap-event-plugin';


before(function () {
    VelocityTransitionGroup.disabledForTest = true;
    chai.use(sinonChai);
    chai.use(chaiEnzyme());
    injectTapEventPlugin();
});
