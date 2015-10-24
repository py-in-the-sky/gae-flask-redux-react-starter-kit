import './e2e/setup';


const e2eTestsContext = require.context('./e2e', true, /-e2e$/);


e2eTestsContext.keys().forEach(e2eTestsContext);
