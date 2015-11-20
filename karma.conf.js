'use strict';

const webpackConfig = require('./webpack.config.js');

// Disable all plugins in test environment due to https://github.com/webpack/karma-webpack/issues/91
// Workaround taken from https://github.com/webpack/karma-webpack/issues/91#issuecomment-158212599
webpackConfig.plugins = [];

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [ 'mocha', 'sinon-chai' ],

    // list of files / patterns to load in the browser
    files: [ 'tests/client/bundle.js' ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'tests/client/bundle.js': [ 'webpack' ]
    },

    webpack: {
      module  : webpackConfig.module,
      resolve : webpackConfig.resolve,
      plugins : webpackConfig.plugins,
      devtool : 'eval',
      cache   : true
    },

    reporters: [ 'mocha' ],

    port      : 9876,             // web server port
    colors    : true,             // enable/disable colors in the output (reporters and logs)
    logLevel  : config.LOG_ERROR, // level of logging. Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    autoWatch : false,            // enable/disable watching file and executing tests whenever any file changes
    browsers  : [ 'Chrome' ],     // start these browsers. Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    singleRun : true              // Continuous Integration mode. If true, Karma captures browsers, runs the tests and exits

  });
};
