'use strict';

module.exports = function(grunt){

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
      case 'server' : return grunt.task.run([ 'env:test',    'mochaTest' ]);
      case 'client' : return grunt.task.run([ 'env:test',    'karma' ]);
      default       : return grunt.task.run([ 'test:server', 'test:client' ]);
    }
  });

};
