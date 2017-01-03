module.exports = {
    devtool: false,
    entry: './src/index.js',
    devServer: {
        contentBase: './',
        port: 3000
    },
    output: {
        path: __dirname,
        filename: 'eruda-dom.js',
        publicPath: "/assets/",
        library: ['erudaDom'],
        libraryTarget: 'umd'
    }
};