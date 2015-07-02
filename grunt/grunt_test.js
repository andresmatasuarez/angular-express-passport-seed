'use strict';

var jshintStylish  = require('jshint-stylish');

module.exports = function(grunt){

  grunt.config('jshint', {
    options: { reporter: jshintStylish },
    client: {
      options : { jshintrc: '<%= paths.client.root %>/.jshintrc' },
      src     : [ '<%= paths.client.root %>/**/*.js' ]
    },
    bo: {
      options : { jshintrc: '<%= paths.bo.root %>/.jshintrc' },
      src     : [ '<%= paths.bo.root %>/**/*.js' ]
    },
    boTests: {
      options : { jshintrc: '<%= paths.tests.bo %>/.jshintrc' },
      src     : [ '<%= paths.tests.bo %>/**/*.spec.js' ]
    },
    server: {
      options : { jshintrc: '.jshintrc' },
      src     : [ '<%= paths.server.root %>/**/*.js' ]
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

  grunt.config('wiredep.karma', {
    src: 'karma.conf.js',
    ignorePath:  /\.\.\//,
    fileTypes: {
      js: {
        block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
        detect: {
          js: /'(.*\.js)'/gi
        },
        replace: {
          js: '\'{{filePath}}\','
        }
      }
    },
    devDependencies: true
  });

  grunt.registerTask('test', function(target){
    switch(target){
      case 'server' : return grunt.task.run([ 'env:test',    'jshint:serverTests', 'mochaTest' ]);
      case 'bo'     : return grunt.task.run([ 'env:test',    'jshint:boTests',     'wiredep:karma', 'karma' ]);
      default       : return grunt.task.run([ 'test:server', 'test:bo' ]);
    }
  });

};
