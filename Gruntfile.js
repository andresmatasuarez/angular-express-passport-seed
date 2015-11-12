'use strict';

var jit          = require('jit-grunt');
var time         = require('time-grunt');
var Environments = require('./server/config/environments');

module.exports = function(grunt){

  // Load grunt tasks automatically when needed.
  jit(grunt, {
    express : 'grunt-express-server',
    webpack : 'grunt-webpack-without-server'
  });

  // Time how long tasks take. Can help when optimizing build times.
  time(grunt);

  // Define the configuration for all the tasks.
  grunt.initConfig({

    paths: {
      dev: {
        assets: 'client',
        server: 'server'
      },
      dist: {
        root   : 'dist',
        assets : 'dist/assets',
        server : 'dist/server'
      },
      tests: {
        client : 'tests/client',
        server : 'tests/server'
      }
    },

    env: {
      test: { NODE_ENV: Environments.test },
      prod: { NODE_ENV: Environments.production }
    }

  });

  // Load tasks
  grunt.loadTasks('grunt');

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('build', [ 'build:dist' ]);
  grunt.registerTask('serve', [ 'serve:dev' ]);

};
