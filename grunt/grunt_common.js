'use strict';

const webpackConfig = require('../webpack.config.js');

module.exports = function(grunt) {

  grunt.config('webpack', {
    options: webpackConfig
  });

};
