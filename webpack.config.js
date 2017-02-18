var autoprefixer = require('autoprefixer'),
    postcss = require('postcss'),
    webpack = require('webpack'),
    pkg = require('./package.json'),
    classPrefix = require('postcss-class-prefix');

var isProduction = process.argv.indexOf('-p') > -1,
    banner = pkg.name + ' v' + pkg.version + ' ' + pkg.homepage;

var exports = {
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
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loaders: ['css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function ()
                        {
                            return [postcss.plugin('postcss-namespace', function ()
                            {
                                // Add '.dev-tools .tools ' to every selector.
                                return function (root)
                                {
                                    root.walkRules(function (rule)
                                    {
                                        if (!rule.selectors) return rule;

                                        rule.selectors = rule.selectors.map(function (selector)
                                        {
                                            return '.dev-tools .tools ' + selector;
                                        });
                                    });
                                };
                            }), classPrefix('eruda-'), autoprefixer];
                        }
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(banner)
    ]
};

if (isProduction)
{
    exports.output.filename = 'eruda-dom.min.js';
    exports.plugins = exports.plugins.concat([
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            comments: /eruda-dom/
        }),
        new webpack.optimize.DedupePlugin()
    ]);
}

module.exports = exports;