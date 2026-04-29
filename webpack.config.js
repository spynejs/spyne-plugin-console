import path from 'path'
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackRxjsExternals from 'webpack-rxjs-externals'

const _defaultAssetsDirName = 'assets'
const port = 8076

export default (env = { mode: 'development', build: false }) => {
  const mode = env.mode || 'development'
  const _isProduction = env.build === true

  const _relativeRoot = './'
  const _publicPath = _isProduction ? _relativeRoot : '/'
  const _assetsFolder = _isProduction ? `${_defaultAssetsDirName}/` : ''

  let entryFile = { index: './src/index.js' }
  const libraryName = 'spyne-plugin-console'
  let externalsArr = []

  if (_isProduction) {
    entryFile = `./src/app/${libraryName}.js`
    externalsArr = [
      WebpackRxjsExternals(),
      {
        spyne: {
          commonjs: 'spyne',
          commonjs2: 'spyne',
          amd: 'spyne',
          root: 'spyne'
        }
      }
    ]
  }

  const config = {
    mode,
    stats: _isProduction ? 'none' : 'all',
    entry: entryFile,
    externals: externalsArr,

    output: {
      filename: _isProduction ? `${libraryName}.min.js` : 'assets/js/[name].js',
      path: path.resolve(process.cwd(), 'lib'),
      clean: true,
      publicPath: _publicPath,
      library: {
        name: libraryName,
        type: 'umd'
      }
    },

    devtool: _isProduction ? false : 'inline-cheap-source-map',

    devServer: {
      static: {
        directory: 'src'
      },
      historyApiFallback: true,
      port
    },

    plugins: getWebpackPlugins(_isProduction, _assetsFolder),

    optimization: _isProduction
        ? {}
        : {
          splitChunks: {
            cacheGroups: {
              common: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                chunks: 'all'
              }
            }
          }
        },

    module: {
      rules: [
        {
          test: /\.html$/,
          loader: 'html-loader',
          options: {
            minimize: false,
            esModule: false
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            !_isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset'
        },
        {
          test: /\.json$/,
          type: 'javascript/auto',
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `${_assetsFolder}static/data/[name].[ext]`
              }
            }
          ]
        }
      ]
    },

    resolve: {
      alias: {
        plugins: path.resolve(process.cwd(), 'src/plugins/'),
        imgs: path.resolve(process.cwd(), 'src/static/imgs/'),
        fonts: path.resolve(process.cwd(), 'src/static/fonts/'),
        data: path.resolve(process.cwd(), 'src/static/data/'),
        css: path.resolve(process.cwd(), 'src/css/'),
        core: path.resolve(process.cwd(), 'src/core/'),
        traits: path.resolve(process.cwd(), 'src/app/traits/'),
        channels: path.resolve(process.cwd(), 'src/app/channels/'),
        components: path.resolve(process.cwd(), 'src/app/components/'),
        node_modules: path.resolve(process.cwd(), 'node_modules/')
      },
      extensions: ['.js', '.css']
    }
  }

  return config
}

function getWebpackPlugins(_isProduction, _assetsFolder) {
  const miniCssPlugin = () =>
      new MiniCssExtractPlugin({
        filename: `${_assetsFolder}/css/main.css`
      })

  const definePlugin = new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  })

  const htmlPlugin = new HtmlWebpackPlugin({
    template: './src/index.tmpl.html',
    minify: false
  })

  return _isProduction
      ? [definePlugin, miniCssPlugin()]
      : [htmlPlugin, definePlugin]
}
