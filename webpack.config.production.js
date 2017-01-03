const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const SvgStore = require('webpack-svgstore-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('style.[chunkhash].css');

module.exports = {
  context: __dirname,

  cache: true,

  entry: {
    app: ['./client/app.js'],
    vendor: ['react', 'react-dom', 'redux-thunk', 'redux-logger']
  },

  output: {
    path: path.resolve(__dirname, './.bin'),
    filename: '[name].[chunkhash].js',
    publicPath: '/static/'
  },

  devtool: 'cheap-module-source-map',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style!css!postcss'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: extractCSS.extract(['css', 'postcss', 'sass'])
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        exclude: /node_modules/,
        loader: 'url?limit=1000'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file'
      }
    ]
  },

  sassLoader: {
    includePaths: [
      path.resolve(process.cwd(), 'node_modules')
    ]
  },

  postcss() {
    return [autoprefixer];
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),

    new SvgStore({
      prefix: 'glyph-',
      svgoOptions: {
        plugins: [{ removeTitle: true }]
      }
    }),

    extractCSS,

    new WebpackMd5Hash(),

    new AssetsPlugin({
      fullPath: false
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),

    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.optimize.DedupePlugin(),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    })
  ]
};
