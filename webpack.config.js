const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ip = require('ip');
const i18nPlugin = require('./plugins/i18next-detector-plugin');
const i18nConfig = require('./src/translations/i18nConfig');

const ipAddress = ip.address();

module.exports = {
    mode: "development",
    devtool: 'source-map',
    devServer: {
        host: ipAddress,
        inline: true,
        historyApiFallback: true,
        hot: true,
        overlay: {
            warnings: true,
            errors: true,
        },
        stats: 'errors-only',
    },
    entry: path.join(__dirname, './src/index'),
    output: {
        filename: '[hash].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [/\/node_modules\//, /\\node_modules\\/],
                loader: 'ts-loader'
            },
            {
                test: /\.[(png)|(json)]$/,
                loader: 'file-loader'
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require("dart-sass")
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {
                        loader: 'less-loader',
                        options: {javascriptEnabled: true},
                    },
                ],
                include: [/\/node_modules\/antd\/es\//, /\\node_modules\\antd\\es\\/],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'web coder',//用于生成的HTML文档的标题
            template: './index.html', //默认index.html位置
        }),
        new webpack.HotModuleReplacementPlugin(),
        new i18nPlugin(path.resolve(__dirname, './src/**/*.{ts,tsx}'),
            path.resolve(__dirname, './src/translations'), i18nConfig.i18nScannerOptions)
    ],
}