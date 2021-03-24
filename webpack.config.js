const path = require("path");
const Dotenv = require('dotenv-webpack');
// export default {
module.exports = {
    mode: 'development',
    node: {
        fs: "empty"
    },
    entry: path.resolve(__dirname, 'src','app','index.jsx'),
    output: {
        globalObject: "this",
        path: path.resolve(__dirname,'dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js','.jsx','.tsx','.json']
    },
    devServer: {
        host:'localhost',
        port: 3000,
        historyApiFallback: true
    },

    module: {
        rules: [{
            test: /\.jsx?/,
            loader:'babel-loader',
        },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.json$/,
                use: ['json-loader'],
                type: 'javascript/auto'
            },
            {
                test: /\.ts$/,
                use: 'ts-loader', exclude: /node_modules/
            },
            ]
    },
    plugins: [
        new Dotenv()
    ]
}
