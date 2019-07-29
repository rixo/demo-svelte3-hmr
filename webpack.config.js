/* eslint-env node */

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'
const dev = !prod

// Optimistic tries to preserve components' state accross compile / runtime
// errors, by displaying error placeholders components to prevent full reload.
//
// This is obviously a very tricky business, and the app / HMR will end in an
// undetermined state more often.
//
// Yet, the trade off may still be preferable for some people. Your state is
// preserved for a longer time, in exchange you have to manually hit ctrl-r
// more often. And also the occasional ctrl-r to clear the doubt: does my app
// really have a problem, or is that a HMR glitch?
//
// Webpack Dev Server's own compile error overlay is not useful when optimistic
// is ON, because Webpack won't see compile errors as such anymore. Otherwise
// it's pretty cool in HMR context, so we advise to have one or the other.
//
// NOTE Optimistic is not correctly implemented currently in svelte-loader.
//
const optimistic = false
const overlay = !optimistic

module.exports = {
  entry: {
    bundle: ['./src/main.js'],
  },
  resolve: {
    alias: {
			svelte: path.resolve('node_modules', 'svelte'),
    },
    extensions: ['.mjs', '.js', '.svelte'],
  },
  output: {
    path: __dirname + '/public',
    filename: '[name].js',
    chunkFilename: '[name].[id].js',
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            // waiting for: https://github.com/rixo/svelte-loader/issues/2
            emitCss: false,
            hotReload: true,
            hotOptions: {
              // will display compile error in the client, avoiding page
              // reload on error
              optimistic: true,
            },
            dev,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  optimization: {
    minimize: false,
  },
  devtool: prod ? false : 'source-map',
  devServer: {
    contentBase: 'public',
    hot: true,
    overlay,
  },
}
