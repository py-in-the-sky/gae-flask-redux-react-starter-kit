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
    files: ['browser_client/__test__/index.js'],
    preprocessors: { 'browser_client/**/*': ['webpack'] },

    webpack: {
        resolve: {
            extensions: ['', '.js']
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
  });
};
