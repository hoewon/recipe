var webpack = require('webpack')

module.exports = {
    entry: __dirname+'/entry.js',
    output: {
        path: __dirname+'/assets/js',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test:/\.css$/, loader: 'style!css' },
            //{ test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.(png|jpg)$/, loader: 'url?./js/limit=8192&name=img/[name].[ext]' },
            { test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/, loader: 'url' }

        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
}

