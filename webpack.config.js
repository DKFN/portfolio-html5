const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new CopyWebpackPlugin([
      { from: 'css/**/*', to: 'static'},
      { from: 'img/**/*', to: 'static' },
      { from: 'langs/**/*', to: 'static' },
      { from: 'vendor/**/*', to: 'static'},
      { from: 'favicon.ico*', to: 'favicon.ico'},
        { from: 'index.html', to: 'index.html'},
    ])
  ],
    module: {
        rules: [
            {
                test: /.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};