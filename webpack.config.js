/* eslint-env node */

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'
const dev = !prod

module.exports = {
  entry: {
    bundle: ['./src/main.js'],
  },
  resolve: {
    alias: {
      svelte: path.resolve(__dirname, 'node_modules', 'svelte'),
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
              // whether to preserve local state (i.e. any `let` variable) or
              // only public props (i.e. `export let ...`)
              noPreserveState: false,
              // optimistic will try to recover from runtime errors happening
              // during component init. This goes funky when your components are
              // not pure enough.
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
    overlay: true,
  },
}
