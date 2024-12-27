// webpack.config.js
import path from 'path'
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackRxjsExternals from 'webpack-rxjs-externals'

// If you need __dirname in an ESM context, uncomment:
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const _defaultAssetsDirName = 'assets'
const port = 8076

export default (env = { mode: 'development', build: false }) => {
  const mode = env.mode || 'development'
  const _isProduction = env.build === true

  // USE '/./' FOR RELATIVE DOMAIN PATHS
  const _relativeRoot = './'
  const _publicPath = _isProduction ? _relativeRoot : '/'
  const _assetsFolder = _isProduction ? `${_defaultAssetsDirName}/` : ''

  let entryFile = { index: './src/index.js' }
  const libraryName = 'spyne-plugin-console'
  let externalsArr = []

  // =================================
  // LIBRARY OPTIONS
  // =================================
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
        'fast-json-stable-stringify': {
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
      }
    ]
  }
  // =================================

  const config = {
    mode,
    stats: _isProduction ? 'none' : 'all',

    // Your entry depends on whether you're building the library or running dev
    entry: entryFile,

    // Don’t bundle RxJS, Spyne, Ramda, etc. if in production mode
    externals: externalsArr,

    output: {
      // For local dev, place output in assets/js/[name].js
      // For a production library build, produce spyne-plugin-console.min.js
      filename: _isProduction ? `${libraryName}.min.js` : 'assets/js/[name].js',

      // Use whatever output path you prefer
      path: path.resolve(process.cwd(), 'lib'),
      clean: true,

      // If building a library, specify how you want it exposed
      library: {
        name: libraryName,
        type: 'umd'
      }
    },

    // For local dev, inline sourcemaps can be handy
    devtool: _isProduction ? false : 'inline-cheap-source-map',

    // Webpack dev server settings for local testing
    devServer: {
      static: {
        directory: 'src'
      },
      historyApiFallback: true,
      port
    },

    // Use a function to generate plugin instances
    plugins: getWebpackPlugins(_isProduction, _assetsFolder),

    // Example optimization config
    optimization: {
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
          // SCSS/CSS handling
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
          // Images
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset'
        },
        {
          // JSON data files
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

// Helper function to produce your plugin array
function getWebpackPlugins(_isProduction, _assetsFolder) {
  const miniCssPlugin = () =>
      new MiniCssExtractPlugin({
        // final CSS filename
        filename: `${_assetsFolder}/css/main.css`
      })

  const definePlugin = new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  })

  const htmlPlugin = new HtmlWebpackPlugin({
    template: './src/index.tmpl.html',
    minify: false
  })

  // In production, do not generate an HTML page, just define constants & extract CSS
  // In dev, generate an index.html for local testing
  return _isProduction
      ? [definePlugin, miniCssPlugin()]
      : [htmlPlugin, definePlugin]
}
