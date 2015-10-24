/* eslint-disable prefer-arrow-callback */

import { VelocityTransitionGroup } from 'velocity-react';
import sinonChai from 'sinon-chai';


before(function () {
    VelocityTransitionGroup.disabledForTest = true;
    chai.use(sinonChai);
});
