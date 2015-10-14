'use strict';

var FILE_LOADER_NAME = 'name=/[name].[hash].[ext]';
var FONT_LOADER_NAME = 'name=/[name].[ext]';

var path                = require('path');
var webpack             = require('webpack');
var AssetsWebpackPlugin = require('assets-webpack-plugin');

var resolvePath = function(p){
  return path.resolve(__dirname, p);
};

module.exports = {
  entry: {
    web       : resolvePath('client/web/entry'),
    dashboard : resolvePath('client/dashboard/entry')
  },
  output: {
    path     : resolvePath('./bundle'),
    filename : '[name].[hash].bundle.js'
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee' },
      { test: /\.less$/,   loader: 'style!css!less' },
      { test: /\.css$/,    loader: 'style!css' },

      // ngtemplate loader only for path whose filename begins with "_"
      // Examples:
      //   _partial.jade                 --> Matches
      //   /_partial.jade                --> Matches
      //   ./_partial.jade               --> Matches
      //   ./partials/_partial.jade      --> Matches
      //   ../../partials/_partial.jade  --> Matches
      //   /../../partials/_partial.jade --> Matches
      //   ./partials/partial.jade       --> Matches not
      { test: /^\.{0,2}\/?(.+\/)*[^_]+\.jade$/, loader: 'html!jade-html' },
      { test: /^\.{0,2}\/?(.+\/)*_.+\.jade$/,   loader: 'ngtemplate?relativeTo=' + __dirname + '/client/!html!jade-html' },

      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url?' + FILE_LOADER_NAME + '&limit=8192&hash=sha512&digest=hex',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },

      // Fonts
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,      loader: 'url?' + FONT_LOADER_NAME + '&limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file?' + FONT_LOADER_NAME }
    ]
  },
  resolve: {
    extensions         : [ '', '.js', '.json', '.coffee' ],
    modulesDirectories : [ 'node_modules' ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name      : 'commons',
      minChunks : 2
    }),

    new AssetsWebpackPlugin({ path: './bundle' })
  ]
};
