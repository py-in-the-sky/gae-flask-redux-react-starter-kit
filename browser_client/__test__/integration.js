import './integration/setup';


var integrationTestsContext = require.context('./integration', true, /-integration$/);


integrationTestsContext.keys().forEach(integrationTestsContext);
