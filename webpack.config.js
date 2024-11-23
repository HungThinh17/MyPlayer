const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve('dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      publicPath: isProduction ? 'dist/' : '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'] // Added this line
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: isProduction ? '../index.html' : 'index.html',
        templateParameters: {
          isProduction: isProduction
        }
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'resources', to: 'resources' },
          { from: 'site.webmanifest', to: '' },
          { from: 'serviceworker.js', to: '' }
        ]
      })
    ],

    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
      hot: true,
    },
    devtool: isProduction ? false : 'eval-cheap-module-source-map',
    performance: isProduction ? {
      maxAssetSize: 400000, // Increase size limit (e.g., 300 KiB)
      hints: 'warning',     // Keep it as a warning instead of an error
    }: false,
    optimization: {
      minimize: isProduction,
      splitChunks: {
        chunks: 'all',
      },
    },
    mode: isProduction ? 'production' : 'development',
  };
};
