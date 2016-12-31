const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const SvgStore = require('webpack-svgstore-plugin');


module.exports = {
  context: __dirname,

  cache: true,

  entry: {
    app: [
      './client/app.js',
      'webpack/hot/dev-server',
      'webpack-dev-server/client?http://localhost:3030/'
    ],
    vendor: ['react', 'react-dom']
  },

  output: {
    path: path.resolve(__dirname, './.bin'),
    filename: 'bundle.[name].js',
    publicPath: '/static/'
  },

  devtool: 'source-map',

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

    new webpack.HotModuleReplacementPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
  ]
};
