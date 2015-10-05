'use strict';

var jit          = require('jit-grunt');
var time         = require('time-grunt');
var Environments = require('./server/config/environments');

module.exports = function(grunt){

  // Load grunt tasks automatically when needed.
  jit(grunt, {
    injector             : 'grunt-asset-injector',
    useminPrepare        : 'grunt-usemin',
    express              : 'grunt-express-server',
    ngtemplates          : 'grunt-angular-templates',
    'webpack-dev-server' : 'grunt-webpack',
  });

  // Time how long tasks take. Can help when optimizing build times.
  time(grunt);

  // Define the configuration for all the tasks.
  grunt.initConfig({

    paths: {
      bower_components: 'bower_components',
      client: {
        root   : 'client',
        assets : 'client/assets'
      },
      bo: {
        root   : 'dashboard',
        assets : 'dashboard/assets'
      },
      server: {
        root   : 'server'
      },
      dist: {
        root   : 'dist',
        client : 'dist/client',
        bo     : 'dist/dashboard',
        assets : 'dist/assets',
        server : 'dist/server'
      },
      tests: {
        client : 'tests/client',
        bo     : 'tests/dashboard',
        server : 'tests/server'
      }
    },

    env: {
      test: { NODE_ENV: Environments.test },
      prod: { NODE_ENV: Environments.production }
    }

  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function(){
    this.async();
  });

  grunt.loadTasks('grunt');

  grunt.registerTask('build', [ 'build:dist' ]);
  grunt.registerTask('serve', [ 'serve:dev' ]);

};
