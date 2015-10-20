'use strict';

module.exports = function(config){
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'mocha',
      'sinon-chai'
    ],

    // list of files / patterns to load in the browser
    files: [
      // TODO: add client bundle

      'tests/client/dashboard/helpers.js',
      'tests/client/dashboard/**/*.mock.js',
      'tests/client/dashboard/**/*.spec.js',
      'client/dashboard/**/*.coffee',
      'client/dashboard/**/*.jade',
      'client/dashboard/index.html'
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'client/dashboard/**/*.jade'   : 'ng-jade2js',
      'client/dashboard/**/*.html'   : 'html2js',
      'client/dashboard/**/*.coffee' : 'coffee'
    },

    ngJade2JsPreprocessor: {
      moduleName  : 'dashboardTemplates',
      stripPrefix : 'client/dashboard/'
    },

    reporters: [ 'mocha' ],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
