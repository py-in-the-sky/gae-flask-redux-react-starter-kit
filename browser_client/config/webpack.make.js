var path    = require('path');
var webpack = require('webpack');
const assign = require('lodash').assign;


var devPublicPath = 'http://localhost:8081/static/';
// Trailing slash is critical.
// The JS, CSS, etc. serverd by the webpack dev server will
// be available at publicPath.
// Conceptually, devPublicPath will be your local dev CDN for
// your own JS, CSS, etc. bundles.

var context = path.join(__dirname, '..', '..');


var configDefaults = {
    context: context,
    entry: path.join(context, 'browser_client', 'index.js'),
    output: {
        filename:   '[name].js',
        path:       path.join(context, 'app', 'static'),
        publicPath: '/static',
    },
    resolve: { extensions: ['', '.js'] },
    externals: { jquery: '$' },
    module: {
        loaders: [
            {
                test:    /\.js$/,
                include: [
                    /browser_client\/index\.js$/,
                    /browser_client\/src/,
                ],
                loader:  'babel-loader'
            },
        ],
    },
};


var codeCoveragePreloader = {
    preLoaders: [
        {
            test: /\.js$/,
            include: /browser_client\/src/,
            loader: 'isparta-instrumenter'
        }
    ]
};


module.exports = function makeWebpackConfig (opts) {
    var __DEV__      = Boolean(opts.__DEV__);
    var __TEST__     = Boolean(opts.__TEST__);
    var __COVERAGE__ = Boolean(opts.__COVERAGE__);

    var EnvironmentPlugin = new webpack.DefinePlugin({
        __DEV__:  __DEV__,
        __TEST__: __TEST__,
    });

    if (__DEV__) {
        return assign({}, configDefaults, {
            debug: true,
            displayErrorDetails: true,
            outputPathinfo: true,
            devtool: 'eval',
            entry: [
                'webpack-dev-server/client?' + devPublicPath,  // for non-hot updates
                'webpack/hot/only-dev-server',                 // for hot updates
                configDefaults.entry
            ],
            output: assign({}, configDefaults.output, {
                publicPath: devPublicPath,
                devtoolModuleFilenameTemplate: '[resourcePath]',
                devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
            }),
            plugins: [ EnvironmentPlugin ],
        });
    }
    else if (__TEST__) {
        var preLoaders = __COVERAGE__ ? codeCoveragePreloader : {};

        return {
            devtool: 'inline-source-map',
            resolve: configDefaults.resolve,
            plugins: [ EnvironmentPlugin ],
            module:  assign({}, preLoaders, {
                loaders: [
                    {
                        test: /\.js$/,
                        include: [
                            /browser_client\/src/,
                            /browser_client\/__test__/,
                        ],
                        loader: 'babel-loader'
                    },
                ],
            }),
        };
    }
    else {
        return assign({}, configDefaults, {
            plugins: [
                EnvironmentPlugin,
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin(),
                new webpack.optimize.OccurenceOrderPlugin(),
            ],
        });
    }
}
