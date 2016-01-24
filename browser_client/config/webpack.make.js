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
    entry: path.join(context, 'browser_client', 'src', 'index.js'),
    output: {
        filename:   '[name].js',
        path:       path.join(context, 'gae', 'static'),
        publicPath: '/static',
    },
    resolve: {
        root: path.join(context, 'browser_client', 'src'),
        extensions: ['', '.js'],
    },
    // externals: { jquery: '$' },
};


var defautlBabelPresets = [ 'react', 'es2015', 'stage-2' ];
var defaultBabelPlugins = [ 'transform-runtime', 'add-module-exports' ];


var codeCoveragePreloader = {
    preLoaders: [
        {
            test: /\.js$/,
            include: /browser_client\/src/,
            loader: 'isparta-instrumenter',
            query: {
                babel: {
                    presets: defautlBabelPresets,
                    plugins: defaultBabelPlugins,
                },
            },
        }
    ]
};


module.exports = function makeWebpackConfig (opts) {
    var __DEV__      = Boolean(opts.__DEV__);
    var __TEST__     = Boolean(opts.__TEST__);
    var __COVERAGE__ = Boolean(opts.__COVERAGE__);

    var nodeEnv;
    if (__DEV__) nodeEnv = 'development';
    else if (__TEST__) nodeEnv = 'test';
    else nodeEnv = 'production';

    var EnvironmentPlugin = new webpack.DefinePlugin({
        __DEV__:  __DEV__,
        __TEST__: __TEST__,
        'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
        // Set process.env.NODE_ENV to 'production' when not in dev mode.
        // Must use this plugin and not an environment variable.
        // Will optimize react build in production, including skipping
        // proptype checks.
        // https://github.com/webpack/react-starter/blob/master/make-webpack-config.js#L131
        // https://facebook.github.io/react/downloads.html#npm
        // https://github.com/facebook/react/issues/2938
    });

    var babelPresets = defautlBabelPresets;
    var babelPlugins = defaultBabelPlugins;
    if (__DEV__) {
        babelPresets = babelPresets.concat('react-hmre');
    }
    else if (__TEST__) {
        null;
    }
    else {  // production
        babelPlugins = babelPlugins.concat('transform-remove-debugger');
    }

    configDefaults['module'] = {
        loaders: [
            {
                test:    /\.js$/,
                include: __TEST__
                    ? [ /browser_client\/src/,  /browser_client\/__test__/ ]
                    : [ /browser_client\/src/ ],
                exclude: /node_modules/,
                loader:  'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: babelPresets,
                    plugins: babelPlugins,
                },
            },
        ],
    };

    if (__DEV__) {
        // SIDE EFFECT: copy `index.dev.html` to `gae/static/index.html`
        var fs = require('fs-extra');
        var htmlTemplate = path.join('browser_client', 'html', 'index.dev.html');
        var htmlTarget = path.join('gae', 'static', 'index.html');
        fs.ensureFileSync(htmlTarget);
        fs.copy(htmlTemplate, htmlTarget, { clobber: true });

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
            resolve: assign({}, configDefaults.resolve, {
                alias: { 'sinon': 'sinon/pkg/sinon' },  // NB: config for `enzyme`
                // for getting `enzyme` up and running with `webpack` and `karma`, see:
                //  https://github.com/davezuko/react-redux-starter-kit/issues/328
                //  https://github.com/airbnb/enzyme/issues/47
                //  http://spencerdixon.com/blog/test-driven-react-tutorial.html
            }),
            externals: {  // NB: config for `enzyme`
                'jsdom': 'window',
                'cheerio': 'window',
                'react/lib/ExecutionEnvironment': true,
                'react/lib/ReactContext': 'window',
            },
            plugins: [ EnvironmentPlugin ],
            module:  assign({}, preLoaders, {
                loaders: configDefaults.module.loaders.concat({
                    // NB: config for `enzyme`
                    test: /\.json$/,
                    loader: 'json',
                }),
                noParse: [  // NB: config for `enzyme`
                    /node_modules\/sinon\//,
                ],
            }),
        };
    }
    else {
        var HtmlWebpackPlugin = require('html-webpack-plugin');

        return assign({}, configDefaults, {
            plugins: [
                EnvironmentPlugin,
                new HtmlWebpackPlugin({
                    template: path.join('browser_client', 'html', 'index.prod.html'),
                    // favicon: '',
                    inject: 'body',  // Inject all scripts into the body
                    hash: true,
                    minify: {
                        collapseWhitespace: true,
                        minifyJS: true,
                        minifyCSS: true
                    },
                }),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin(),
                new webpack.optimize.OccurenceOrderPlugin(),
            ],
        });
    }
}
