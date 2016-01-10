var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev');


var compiler = webpack(config);


new WebpackDevServer(compiler, {
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    hot: true,
    inline: true,
    noInfo: true,
    noCredentials: true,
    withCredentials: false,
    // port: 8081,
}).listen(8081, 'localhost', function (err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log('Webpack Dev Server listening at localhost:8081');
    }
});
