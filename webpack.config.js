const webpack  = require('webpack');
const config   = {
    target  : 'web',
    entry   : './jf-object.mjs',
    output  : {
        path          : __dirname,
        pathinfo      : true,
        filename      : 'jf-object.js',
        library       : 'jfObject',
        libraryTarget : 'umd'
    },
    module  : {
        loaders : [
            {
                test   : /\.mjs$/,
                loader : 'babel-loader',
                query  : {
                    plugins : [
                        'transform-class-properties',
                        'transform-object-assign',
                        'transform-runtime'
                    ],
                    presets : [
                        [
                            'es2015',
                            {
                                modules : false
                            }
                        ]
                    ]
                }
            }
        ]
    },
    plugins : [
        new webpack.optimize.UglifyJsPlugin(
            {
                compress : true,
                mangle   : {
                    keep_fnames : true
                }
            }
        )
    ],
    resolve : {
        extensions : ['.js', '.mjs']
    }
};
module.exports = config;
