var path    = require('path');
var webpack = require('webpack');
var _       = require('lodash');


var __DEV__ = (process.env.NODE_ENV === 'development');
var EnvironmentPlugin = new webpack.DefinePlugin({ __DEV__: __DEV__ });


var entryPoint = path.join(__dirname, 'browser_client', 'index.js');
var publicPath = 'http://localhost:8080/assets/';
// trailing slash is critical
// the JS, CSS, etc. serverd by the webpack dev server will
// be available at publicPath
// conceptually, publicPath will be your local dev CDN for
// your own JS, CSS, etc. bundles


var outputTemplate = {
    filename: '[name].js',
    path:     path.join(__dirname, 'app', 'assets')
};
var resolveTemplate = { extensions: ['', '.js'] };
var externalsTemplate = { jquery: '$' }


function buildWebpackConfig () {
    if (__DEV__) {
        var devOutputAdditions = {
            publicPath: publicPath,
            devtoolModuleFilenameTemplate: '[resourcePath]',
            devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
        };

        return {
            debug: true,
            displayErrorDetails: true,
            outputPathinfo: true,
            devtool: 'eval',

            context: __dirname,

            entry: [
                'webpack-dev-server/client?' + publicPath,  // for non-hot updates
                'webpack/hot/only-dev-server',              // for hot updates
                entryPoint
            ],

            output:    _.merge({}, outputTemplate, devOutputAdditions),
            resolve:   resolveTemplate,
            externals: externalsTemplate,

            plugins: [ EnvironmentPlugin ],

            module: {
                loaders: [
                    {
                        test:    /\.js$/,
                        exclude: /node_modules/,
                        loaders: ['babel-loader']
                    },
                ],
            },
        };
    }
    else if (process.env.NODE_ENV === 'test') {
        const publicPath = 'http://localhost:8080/browser_client/__test__/integration';

        return {
            context:   __dirname,
            entry: [
                'webpack-dev-server/client?' + publicPath,
                path.join(__dirname, 'browser_client', '__test__', 'integration', 'index.js')
            ],
            output: {
                filename: 'integration-tests.js',
                publicPath: publicPath
            },
            resolve:   resolveTemplate,
            plugins: [ EnvironmentPlugin ],

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
    }
    else {
        return {
            context:   __dirname,
            entry:     entryPoint,
            output:    _.merge({}, outputTemplate, { publicPath: '/assets' }),
            resolve:   resolveTemplate,
            externals: externalsTemplate,

            plugins: [
                EnvironmentPlugin,
                new webpack.optimize.UglifyJsPlugin(),
                new webpack.optimize.OccurenceOrderPlugin(),
            ],

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
    }
}


module.exports = buildWebpackConfig();
