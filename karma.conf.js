/*
    see:
        http://karma-runner.github.io/0.13/config/configuration-file.html
        https://github.com/webpack/karma-webpack/tree/master/example
 */



var webpack = require('webpack');


var EnvironmentPlugin = new webpack.DefinePlugin({
    __DEV__: false,
    __TEST__: true,
});


module.exports = function (config) {
  config.set({
    basePath: '',
    reportSlowerThan: 150,
    frameworks: ['mocha', 'chai', 'sinon'],
    reporters: ['dots'],
    browsers: ['Chrome'],
    client: { useIframe: false },
    files: ['browser_client/__test__/integration/index.js'],
    preprocessors: { 'browser_client/**/*': ['webpack'] },

    webpack: {
        resolve: {
            extensions: ["", ".js"]
        },
        plugins: [ EnvironmentPlugin ],
        module: {
            loaders: [
                {
                    test:    /\.js$/,
                    exclude: /node_modules/,
                    loader:  'babel-loader'
                }
            ]
        }
    },

    webpackMiddleware: {
        stats: {
            colors: true
        }
    },

    // List plugins explicitly, since autoloading karma-webpack
    // won't work here
    // [rmw] it does work now
    // plugins: [
    //     require("karma-mocha"),
    //     require("karma-spec-reporter"),
    //     require("karma-chrome-launcher"),
    //     require("karma-webpack")
    // ]
  });
};
