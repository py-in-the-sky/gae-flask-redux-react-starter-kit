var path    = require('path');
var webpack = require('webpack');


var devPublicPath = 'http://localhost:8080/assets/';
// Trailing slash is critical.
// The JS, CSS, etc. serverd by the webpack dev server will
// be available at publicPath.
// Conceptually, devPublicPath will be your local dev CDN for
// your own JS, CSS, etc. bundles.


var configDefaults = {
    context: __dirname,
    entry: path.join(__dirname, 'browser_client', 'index.js'),
    output: {
        filename: '[name].js',
        path:     path.join(__dirname, 'app', 'assets')
    },
    resolve: { extensions: ['', '.js'] },
    externals: { jquery: '$' },
    module: {
        loaders: [
            {
                test:    /\.js$/,
                exclude: /node_modules/,
                loader:  'babel-loader'
            },
        ],
    },
};


module.exports = function makeWebpackConfig (opts) {
    var __DEV__  = Boolean(opts.__DEV__);
    var __TEST__ = Boolean(opts.__TEST__);

    var EnvironmentPlugin = new webpack.DefinePlugin({
        __DEV__:  __DEV__,
        __TEST__: __TEST__,
    });

    if (__DEV__)
        return Object.assign({}, configDefaults, {
            debug: true,
            displayErrorDetails: true,
            outputPathinfo: true,
            devtool: 'eval',
            entry: [
                'webpack-dev-server/client?' + devPublicPath,  // for non-hot updates
                'webpack/hot/only-dev-server',                 // for hot updates
                configDefaults.entry
            ],
            output: Object.assign({}, configDefaults.output, {
                publicPath: devPublicPath,
                devtoolModuleFilenameTemplate: '[resourcePath]',
                devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
            }),
            plugins: [ EnvironmentPlugin ],
        });

    if (__TEST__)
        return {
            devtool: 'inline-source-map',
            resolve: configDefaults.resolve,
            plugins: [ EnvironmentPlugin ],
            module: configDefaults.module,
        };

    else
        return Object.assign({}, configDefaults, {
            output: Object.assign({}, configDefaults.output, {
                publicPath: '/assets',
            }),
            plugins: [
                EnvironmentPlugin,
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin(),
                new webpack.optimize.OccurenceOrderPlugin(),
            ],
        });
}
