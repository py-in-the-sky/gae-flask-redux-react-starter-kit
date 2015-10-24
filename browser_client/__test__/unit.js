import './setup';


const unitTestsContext = require.context('.', true, /-test$/);


unitTestsContext.keys().forEach(unitTestsContext);
