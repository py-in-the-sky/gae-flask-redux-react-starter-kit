const appSrcFiles = require.context('app', true, /\.js/);
appSrcFiles.keys().forEach(appSrcFiles);


require('./all');
