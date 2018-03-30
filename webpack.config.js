var webpack = require('webpack');
require("babel-polyfill");

/*
 * Default webpack configuration for development
 */
var config = {
    devtool: 'eval-source-map',
    entry:  ["babel-polyfill", __dirname + "/source/app.js","whatwg-fetch"],
    output: {
        path: __dirname + "/public",
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use:[{
                loader:'babel-loader',
                query: {
                    presets: ['es2015','react']
                }
            }]
        }]
    },
    devServer: {
        contentBase: "./public",
        historyApiFallback: true,
        inline: true
    },
}

/*
 * If bundling for production, optimize output
 */
if (process.env.NODE_ENV === 'production') {
    config.devtool = false;
    config.plugins = [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({comments: false}),
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: JSON.stringify('production')}
        })
    ];
};

module.exports = config;
