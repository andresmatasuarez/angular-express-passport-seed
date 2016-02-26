'use strict';

const webpack             = require('webpack');
const AssetsWebpackPlugin = require('assets-webpack-plugin');
const NgAnnotatePlugin    = require('ng-annotate-webpack-plugin');

module.exports = function(grunt) {

  grunt.config('express.dist', {
    options: {
      script : '<%= paths.dist.server %>/bin/web.js',
      debug  : true
    }
  });

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

  grunt.config('clean.dist', {
    files: [{
      dot: true,
      src: [ '<%= paths.dist.root %>' ]
    }]
  });

  grunt.config('copy.dist', {
    files: [{
      expand : true,
      dest   : '<%= paths.dist.root %>',
      src    : [
        'Procfile',
        'package.json',
        'npm-shrinkwrap.json',
        'server/**/*',
        '!<%= paths.dev.server %>/config/ssl/**/*'
      ]
    }]
  });

  grunt.registerTask('build:dist', [
    'clean:dist',
    'copy:dist',
    'webpack:dist'
  ]);

  grunt.registerTask('serve:dist', [ 'env:prod', 'build:dist', 'express:dist', 'wait' ]);

};
