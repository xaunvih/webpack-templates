const path = require('path')
const fs = require('fs')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DEV_MODE = process.env.npm_lifecycle_event == 'start'

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: {
        app: path.resolve(__dirname, 'src/js/main.js'),
    },
    resolve: {
        extensions: ['.js', '.json', '.hbs', '.handlebars', '.ejs'],
        alias: {
            scss: path.resolve(__dirname, 'src/scss'),
        },
    },
    output: {
        path: path.resolve('build'),
        filename: '[name].js',
    },
    plugins: [
        new CleanWebpackPlugin(),
        ...initWebpackHtmlWithDir('src/templates/ejs'),
        ...initWebpackHtmlWithDir('src/templates/handlebar'),
        ...initWebpackHtmlWithDir('src/templates/pug'),
    ],
    module: {
        rules: [
            {
                test: /\.ejs$/,
                use: ['html-loader', 'ejs-html-loader'],
            },
            {
                test: /\.pug$/,
                loader: ['raw-loader', 'pug-html-loader'],
            },
            {
                test: /\.(hbs|handlebars)$/,
                loader: ['raw-loader', 'handlebars-loader'],
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.resolve('src/js'),
                exclude: /(node_modules)/,
                options: {
                    compact: true,
                },
            },
            {
                test: /\.(scss)/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: DEV_MODE,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: DEV_MODE,
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        contentBase: [path.resolve('./build')],
        watchContentBase: true,
        open: true,
        writeToDisk: true,
        compress: true,
        hot: true,
    },
}

function initWebpackHtmlWithDir(dirPath) {
    const files = fs.readdirSync(dirPath).reduce((arr, file) => {
        if (file.match(/\.(ejs|pug|hds)$/i)) {
            arr.push(
                new HtmlWebpackPlugin({
                    filename: file,
                    template: path.resolve(__dirname, dirPath + '/' + file),
                }),
            )
        }

        return arr
    }, [])

    return files
}
