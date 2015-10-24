const appSrcFiles = require.context('..', true, /src\//);
appSrcFiles.keys().forEach(appSrcFiles);


require('./unit');
require('./integration');
