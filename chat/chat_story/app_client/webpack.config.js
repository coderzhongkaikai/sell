const {
    resolve
} = require('path')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
// const postcssPresetEnv = require('postcss-preset-env');

// process.evn.NODE_ENV='development'

module.exports = {
    entry: ['./src/index.js', './src/index.html'],
    output: {
        filename: 'js/main[hash:5].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',

                    {
                        loader: 'postcss-loader', //有兼容性问题
                        // options:{
                        //     ident:'postcss',
                        //     plugins:()=>[
                        //         require('postcss-preset-env')
                        //     ]
                        // }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader', //有兼容性问题
                        // options:{
                        //     ident:'postcss',
                        //     plugins:()=>[
                        //         require('postcss-preset-env')
                        //     ]
                        // }
                    },
                    'less-loader'
                ]
            },
            {
                test: /\.(jpg|png|gif)/,
                loader: 'url-loader',
                include: path.resolve(__dirname, 'src/image'),
                options: {
                    limit: 8 * 1024,
                    esModule: false,
                    name: '[hash:5].[ext]',
                    outputPath: 'imgs'
                }
            },
            {
                test: /\.html$/,
                // loader:'html-loader'
                loader: 'html-withimg-loader'
            },
            {
                exclude: /\.(css|js|html|less|jpg|png|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]',
                    outputPath: 'media'
                }
            }
        ]
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/index.css'
        }),
        new CssMinimizerPlugin(),
        new CleanWebpackPlugin()
    ],
    mode: 'development',
    devServer: {
        static: resolve(__dirname, 'dist'),
        compress: true,
        host: 'localhost',
        port: 3040,
        open: true,
        hot: true,
        proxy: {
            '/': {
                target: 'http://localhost:3030',
                changeOrigin: true,
                pathRewrite: {
                    // '^/api':''
                }
            },
        
        }
    },
    // devtool:'eval-source-map'
}