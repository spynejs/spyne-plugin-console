const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackRxjsExternals = require('webpack-rxjs-externals');

const _defaultAssetsDirName = "assets";
const port = 8076;

let mode;
let _isProduction;

// USE "/./" FOR ROOT DOMAIN OR "./" FOR RELATIVE DOMAIN PATHS"
let _relativeRoot = "./"
let _publicPath;
let _assetsFolder;

module.exports = (env={mode:"development"})=> {

  mode =           env.mode || 'development';
  _isProduction =   env.build === true;
  _publicPath =     _isProduction ?  _relativeRoot : "/";
  _assetsFolder =   _isProduction ? `${_defaultAssetsDirName}/` : "";

  let entryFile = {index: './src/index.js'};
  let libraryName = 'spyne-plugin-console';
  let externalsArr = [];


  // =================================
  // LIBRARY OPTIONS
  // =================================
  if (_isProduction){
    entryFile  = `./src/app/${libraryName}.js`;
    externalsArr = [
      WebpackRxjsExternals(),

      {
        spyne: {
          commonjs: 'spyne',
          commonjs2: 'spyne',
          amd: 'spyne',
          root: 'spyne'
        }

      },
      {
        ramda: {
          commonjs: 'ramda',
          commonjs2: 'ramda',
          amd: 'ramda',
          root: 'ramda'
        }

      },

      {
        "fast-json-stable-stringify": {
          commonjs: 'fast-json-stable-stringify',
          commonjs2: 'fast-json-stable-stringify',
          amd: 'fast-json-stable-stringify',
          root: 'fast-json-stable-stringify'
        }
      },
      {
        flatted: {
          commonjs: 'flatted',
          commonjs2: 'flatted',
          amd: 'flatted',
          root: 'flatted'
        }
      },


      {
        "highlight.js": {
          commonjs: 'highlight.js',
          commonjs2: 'highlight.js',
          amd: 'highlight.js',
          root: 'highlight.js'
        }
      }


    ];

  }

  // =================================



  const config = {
    mode,

    stats: _isProduction ? 'none' : 'all',

    entry: entryFile,
    externals: externalsArr,

    output: {
      filename: _isProduction ? `${libraryName}.min.js` :  'assets/js/[name].js',
      path: path.resolve(__dirname, 'lib'),
      clean: true,
      library: {name:libraryName, type:'umd'}
    },


    devtool:  _isProduction ? false : 'inline-cheap-source-map',

    devServer: {
      static: {
        directory: 'src',
      },
      historyApiFallback: true,
      port
    },

    plugins:  getWebpackPlugins(),

    optimization: {
      splitChunks: {
        cacheGroups: {
          common: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: 'all',
          }
        },
      }
    },

    module: {
      rules: [
        {
          test: /\.html$/,
          loader: "html-loader",
          options: {
            minimize: false,
            esModule: false,
          }
        },

        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            _isProduction !== true ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader', options: {
                sourceMap: true
              },
            }
          ]
        },

        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset"
        },

        {
          test: /\.(json)$/,
          type: 'javascript/auto',
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `${_assetsFolder}static/data/[name].[ext]`
              },
            }]
        }

      ]
    },

    resolve: {
      alias: {
        plugins: path.resolve(__dirname, 'src/plugins/'),
        imgs: path.resolve(__dirname, 'src/static/imgs/'),
        fonts: path.resolve(__dirname, 'src/static/fonts/'),
        data: path.resolve(__dirname, '/./src/static/data/'),
        css: path.resolve(__dirname, 'src/css/'),
        core: path.resolve(__dirname, 'src/core/'),
        traits: path.resolve(__dirname, 'src/app/traits/'),
        channels: path.resolve(__dirname, 'src/app/channels/'),
        components: path.resolve(__dirname, 'src/app/components/'),
        node_modules: path.resolve(__dirname, 'node_modules/')

      },

      extensions: ['.js', '.css'],
    }
  };

  return config;

}


const getWebpackPlugins = ()=> {

  const miniCssPlugin = ()=> {
    return new MiniCssExtractPlugin({
      filename: `${_assetsFolder}/css/main.css`
    });
  }

  const definePlugin = new webpack.DefinePlugin({
    'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  });

  const htmlPlugin = new HtmlWebpackPlugin({
    template: './src/index.tmpl.html',
    minify: false
  });

  return _isProduction ?
      [definePlugin, miniCssPlugin()] :
      [htmlPlugin, definePlugin];

}
