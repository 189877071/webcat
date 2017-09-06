const webpack = require('webpack');

const path = require('path');

const { upwardDir } = require('../public/fn');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        `${upwardDir(__dirname)}/src/main.js`
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/js/'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_module/,
                loaders: ['babel-loader']
            },
            {
                test: /\.scss$/,
                exclude: /node_module/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(jgp)|(png)|(gif)$/,
                exclude: /node_module/,
                loader: 'url-loader?limit=50000'
            }
        ]
    }
}
