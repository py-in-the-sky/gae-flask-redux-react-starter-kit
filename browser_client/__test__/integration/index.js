import './setup';


var testsContext = require.context(".", true, /-integration$/);


testsContext.keys().forEach(testsContext);
