const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const dist = require("./util/dist");

function configure(env, argv){
    var distEnv = dist.withEnv(env);
    console.log('Building to ' + distEnv.dist);

    const isDebug = (distEnv.name=='dev');
    const browserslist = [
        ">1%",
        "last 4 versions",
        "Firefox ESR",
        "not ie < 9"
    ];

    var config = {
        entry: {
            main: "./client/js/main.js",
        },
        output: {
            path: path.resolve(`./${distEnv.dist}/`),
            filename: "js/[name].js"
        },
        resolve: {
            modules:[
                path.resolve('./components'),
                path.resolve('./data'),
                "node_modules"
            ],
            alias:{
            }
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    include: [
                        path.resolve(__dirname, './client/js/'),
                        path.resolve(__dirname, './components/'),
                        path.resolve(__dirname, './data/')
                    ],
                    query: {
                        // https://github.com/babel/babel-loader#options
                        cacheDirectory: isDebug,

                        // https://babeljs.io/docs/usage/options/
                        babelrc: false,
                        presets: [
                            // https://github.com/babel/babel-preset-env
                            [
                                'env', 
                                {
                                    targets: {
                                        browsers: browserslist,
                                    },
                                    modules: false,
                                    useBuiltIns: false,
                                    debug: false,
                                }
                            ],
                            'react',
                            ...isDebug ? [] : ['react-optimize'],
                        ],
                        plugins: [
                            ...isDebug ? ['transform-react-jsx-source', 'transform-react-jsx-self'] : []
                        ],
                    },
                },
                { 
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader?{discardComments:{removeAll:true}}'
                    })
                },
                { 
                    test: /\.(svg|png|jpg|jpeg)$/, 
                    include: path.resolve(__dirname, 'client/img'),
                    loader: 'file-loader?name=img/[name].[ext]'
                },
                { 
                    test: /\.html$/, 
                    include: path.resolve(__dirname, 'client'),
                    loader: 'file-loader?name=[name].[ext]'
                },
                { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?name=fonts/[name].[ext]" },
                { test: /\.(woff|woff2)$/, loader:"url-loader?name=fonts/[name].[ext]&prefix=font&limit=5000" },
                { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream" },
                { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=image/svg+xml" }
            ]
        },
        externals: [],
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({names:["common", "vendor"], minChunks:2}),
            new ExtractTextPlugin("css/main.css"),
            // new webpack.optimize.UglifyJsPlugin({
            //     sourceMap: true,
            //     compress: {
            //     screw_ie8: true, // React doesn't support IE8
            //     warnings: isVerbose,
            //     unused: true,
            //     dead_code: true,
            //     },
            //     mangle: {
            //     screw_ie8: true,
            //     },
            //     output: {
            //     comments: false,
            //     screw_ie8: true,
            //     },
            // }),
        ],

        // Some libraries import Node modules but don't use them in the browser.
        // Tell Webpack to provide empty mocks for them so importing them works.
        // https://webpack.github.io/docs/configuration.html#node
        // https://github.com/webpack/node-libs-browser/tree/master/mock
        node: {
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
        }
    };

    if(distEnv.name=='prod'){
        config.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true, output: {comments: false}}));
    }
    else if(distEnv.name=='dev'){
    }

    return config;
}

module.exports = configure;