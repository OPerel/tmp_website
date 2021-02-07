const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env) => {
  return {
    mode: env.NODE_ENV,
    entry: './src/index.ts',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.(svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: "[name].[ext]",
                outputPath: "assets",
                esModule: false
              }
            }
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',

      }),
      new webpack.EnvironmentPlugin({
        API: env.production ? 'prod api tba' : 'http://localhost:5000',
      })
    ],
    devServer: {
      contentBase: './dist',
    },
    devtool: 'eval-cheap-source-map',
  }
};