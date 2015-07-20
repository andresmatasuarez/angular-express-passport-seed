'use strict';

var FILE_LOADER_NAME = 'name=[name].[hash].[ext]';

var HTML_TEMPLATE = [
  '<!DOCTYPE html>',
  '<html>',
    '<head>',
      '<meta charset="utf-8">',
      '<base href="{%= o.htmlWebpackPlugin.options.base %}">',
      '<title>{%= o.htmlWebpackPlugin.options.title %}</title>',
    '</head>',
    '<body>',
    '</body>',
  '</html>'
].join('\n');

var path              = require('path');
var webpack           = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var resolvePath = function(p){
  return path.resolve(__dirname, p);
};

module.exports = {
  entry: {
    web       : resolvePath('client/main'),
    dashboard : resolvePath('backoffice/main')
  },
  output: {
    path     : resolvePath('.tmp'),
    filename : '[name].[hash].bundle.js'
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee' },
      { test: /\.less$/,   loader: 'style!css!less' },
      { test: /\.css$/,    loader: 'style!css' },

      // ngtemplate loader only for path whose filename begins with "_"
      // Examples:
      //   _partial.jade            --> Matches
      //   /_partial.jade           --> Matches
      //   ./_partial.jade          --> Matches
      //   ./partials/_partial.jade --> Matches
      //   ./partials/partial.jade  --> Matches not
      { test: /^\.?\/?(.+\/)*[^_]+\.jade$/, loader: 'html!jade-html' },
      { test: /^\.?\/?(.+\/)*_.+\.jade$/,   loader: 'ngtemplate?module=dashboard&relativeTo=' + __dirname + '/backoffice/!html!jade-html' },

      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url?' + FILE_LOADER_NAME + '&limit=8192&hash=sha512&digest=hex',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },

      // Fonts
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,      loader: 'url?' + FILE_LOADER_NAME + '&limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file?' + FILE_LOADER_NAME }
    ]
  },
  resolve: {
    extensions         : [ '', '.js', '.json', '.coffee' ],
    modulesDirectories : [ 'node_modules' ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title           : 'Angular Express seed | Web',
      filename        : 'web.html',
      base            : '/web/',
      templateContent : HTML_TEMPLATE,
      chunks          : [ 'commons', 'web' ],
      inject          : true,
      hash            : true
    }),

    new HtmlWebpackPlugin({
      title           : 'Angular Express seed | Dashboard',
      filename        : 'dashboard.html',
      base            : '/dashboard/',
      templateContent : HTML_TEMPLATE,
      chunks          : [ 'commons', 'dashboard' ],
      inject          : true
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name      : 'commons',
      minChunks : 2
    })
  ]
};
