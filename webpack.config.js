const path = require('path');
const env = require('var');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const packageJson = require('./package.json');

module.exports = {
  context: process.cwd(),
  entry: {
    modulo: './src/modulo.ts',
    'service-worker': './src/service-worker.ts'
  },
  output: {
    publicPath: '/',
    path: path.resolve('./build'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.scss']
  },
  module: {
    rules: [
      // TypeScript
      { test: /\.tsx?$/, loader: 'ts-loader' },

      // SASS
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      },

      // Assets
      {
        test: /\.(jpe?g|ico|gif|png|svg|wav|mp3|json)$/,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.VERSION': JSON.stringify(packageJson.version),
      'process.env': JSON.stringify(env)
    }),
    new HtmlWebpackPlugin({ template: './src/index.ejs' })
  ]
};
