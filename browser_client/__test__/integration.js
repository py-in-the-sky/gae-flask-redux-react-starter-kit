import './integration/setup';


const integrationTestsContext = require.context('./integration', true, /-integration$/);


integrationTestsContext.keys().forEach(integrationTestsContext);
