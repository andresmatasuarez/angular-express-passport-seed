'use strict';

module.exports = function(config) {
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
      //bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/lodash/dist/lodash.compat.js',
      'bower_components/restangular/dist/restangular.js',
      'bower_components/ngstorage/ngStorage.js',
      'bower_components/angular-loading-bar/build/loading-bar.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/ng-table/ng-table.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-breadcrumb/release/angular-breadcrumb.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/angular-mocks/angular-mocks.js',
      //endbower

      'tests/backoffice/helpers.js',
      'tests/backoffice/**/*.mock.js',
      'tests/backoffice/**/*.spec.js',
      'backoffice/**/*.coffee',
      'backoffice/**/*.jade',
      'backoffice/index.html'
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'backoffice/**/*.jade'   : 'ng-jade2js',
      'backoffice/**/*.html'   : 'html2js',
      'backoffice/**/*.coffee' : 'coffee'
    },

    ngJade2JsPreprocessor: {
      moduleName: 'dashboardTemplates',
      stripPrefix: 'backoffice/'
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
