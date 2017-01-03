const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const SvgStore = require('webpack-svgstore-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = {
  context: __dirname,

  cache: true,

  entry: {
    app: [
      './client/app.js'
    ],
    vendor: ['react', 'react-dom', 'react-redux']
  },

  output: {
    path: path.resolve(__dirname, './.bin'),
    filename: '[name].[chunkhash].js',
    publicPath: '/static/'
  },

  devtool: 'eval',

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
        loaders: ['style', 'css?sourceMap', 'postcss', 'sass?sourceMap']
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
    new SvgStore({
      prefix: 'glyph-',
      svgoOptions: {
        plugins: [{ removeTitle: true }]
      }
    }),

    new WebpackMd5Hash(),

    new AssetsPlugin({
      fullPath: false
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
  ]
};
