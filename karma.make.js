/*
    see:
        http://karma-runner.github.io/0.13/config/configuration-file.html
        https://github.com/webpack/karma-webpack/tree/master/example
 */


module.exports = function makeKarmaConfig (opts) {
    var entryFile = opts.__INTEGRATION__
        ? 'browser_client/__test__/integration/index.js'
        : 'browser_client/__test__/index.js';

    var reportSlowerThan = opts.__INTEGRATION__
        ? 750
        : 150;

    return {
        basePath: '',
        reportSlowerThan: reportSlowerThan,
        frameworks: [ 'mocha', 'chai', 'sinon' ],
        reporters: [ 'dots' ],
        browsers: [ 'Chrome' ],
        client: { useIframe: false },
        files: [ entryFile ],
        preprocessors: { 'browser_client/**/*': [ 'webpack' ] },
        webpack: require('./webpack.test'),
        webpackMiddleware: { noInfo: true },
    };
}
