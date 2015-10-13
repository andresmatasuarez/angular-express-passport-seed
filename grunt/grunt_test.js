'use strict';

var jshintStylish  = require('jshint-stylish');

module.exports = function(grunt){

  grunt.config('jshint', {
    options: { reporter: jshintStylish },
    assets: {
      options : { jshintrc: '<%= paths.dev.assets %>/.jshintrc' },
      src     : [ '<%= paths.dev.assets %>/**/*.js' ]
    },
    boTests: {
      options : { jshintrc: '<%= paths.tests.dashboard %>/.jshintrc' },
      src     : [ '<%= paths.tests.dashboard %>/**/*.spec.js' ]
    },
    server: {
      options : { jshintrc: '.jshintrc' },
      src     : [ '<%= paths.dev.server %>/**/*.js' ]
    },
    serverTests: {
      options : { jshintrc: '<%= paths.tests.server %>/.jshintrc' },
      src     : [ '<%= paths.tests.server %>/**/*.spec.js' ]
    }
  });

  grunt.config('mochaTest', {
    options: {
      reporter: 'spec',
    },
    src: [ '<%= paths.tests.server %>/**/*.spec.js' ]
  });

  grunt.config('karma', {
    unit: {
      configFile: 'karma.conf.js'
    }
  });

  grunt.registerTask('test', function(target){
    switch(target){
      case 'server'    : return grunt.task.run([ 'env:test',    'jshint:serverTests',    'mochaTest' ]);
      case 'dashboard' : return grunt.task.run([ 'env:test',    'jshint:dashboardTests', 'karma' ]);
      default          : return grunt.task.run([ 'test:server', 'test:dashboard' ]);
    }
  });

};
