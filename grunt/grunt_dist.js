'use strict';

const webpack             = require('webpack');
const AssetsWebpackPlugin = require('assets-webpack-plugin');
const NgAnnotatePlugin    = require('ng-annotate-webpack-plugin');

module.exports = function gruntDist(grunt) {

  grunt.config('webpack.dist', {
    output: {
      path: '<%= paths.dist.assets %>'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        },
        mangle: false
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new AssetsWebpackPlugin({ path: './dist/assets' }),
      new NgAnnotatePlugin()
    ]
  });

};
