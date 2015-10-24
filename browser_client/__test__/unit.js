import './setup';


var unitTestsContext = require.context('.', true, /-test$/);


unitTestsContext.keys().forEach(unitTestsContext);
