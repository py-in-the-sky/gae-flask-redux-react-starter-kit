var actions = require.context('..', true, /actions\//);
actions.keys().forEach(actions);


var components = require.context('..', true, /components\//);
components.keys().forEach(components);


var containers = require.context('..', true, /containers\//);
containers.keys().forEach(containers);


var middleware = require.context('..', true, /middleware\//);
middleware.keys().forEach(middleware);


var reducers = require.context('..', true, /reducers\//);
reducers.keys().forEach(reducers);


var store = require.context('..', true, /store\//);
store.keys().forEach(store);


var utils = require.context('..', true, /utils\//);
utils.keys().forEach(utils);


require('./index');
require('./integration/index');
