/* eslint-disable no-var */


/*
    see:
        http://karma-runner.github.io/0.13/config/configuration-file.html
        https://github.com/webpack/karma-webpack/tree/master/example
 */
const assign = require('lodash').assign;


module.exports = function makeKarmaConfig (opts) {
    var __E2E__      = Boolean(opts.__E2E__);
    var __ALL__      = Boolean(opts.__ALL__);
    var __COVERAGE__ = Boolean(opts.__COVERAGE__);

    var entryFile;

    if (__E2E__)
        entryFile = 'browser_client/__test__/e2e.js';
    else if (__ALL__)
        entryFile = 'browser_client/__test__/all.js';
    else
        entryFile = 'browser_client/__test__/unit.js';

    var reportSlowerThan = (__E2E__ || __ALL__) ? 750 : 150;

    var config = {
        basePath: '../..',
        reportSlowerThan: reportSlowerThan,
        frameworks: [ 'mocha', 'chai', 'sinon' ],
        reporters: [ 'dots' ],
        browsers: [ 'Chrome' ],
        client: { useIframe: false },
        files: [ entryFile ],
        preprocessors: { 'browser_client/**/*': [ 'webpack', 'sourcemap' ] },
        webpackMiddleware: { noInfo: true },
    };

    if (__COVERAGE__)
        return assign({}, config, {
            reporters: [ 'dots', 'coverage' ],
            coverageReporter: {
                dir:  '__coverage_reports__/browser_client',
                type: 'html'
            },
            webpack: require('./webpack.coverage'),
        });
    else
        return assign({}, config, {
            webpack: require('./webpack.test'),
        });
};
