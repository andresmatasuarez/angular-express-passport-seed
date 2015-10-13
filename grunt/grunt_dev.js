'use strict';

var webpackConfig = require('../webpack.config.js');

module.exports = function(grunt){

  grunt.config('express.dev', {
    options: {
      script : '<%= paths.server.root %>/bin/web.js',
      debug  : true
    }
  });

  grunt.config('clean.dev', {
    files: [{
      dot : true,
      src : [ '.tmp' ]
    }]
  });

  grunt.config('webpack.dev', {});

  grunt.config('watch', {
    assets: {
      files   : [ '{<%= paths.web.root %>,<%= paths.dashboard.root %>}/**/*.{coffee,less,jade}' ],
      tasks   : [ 'build:dev' ],
      options : { spawn: false }
    },
    gruntfile: {
      files   : [ 'Gruntfile.js', 'grunt/*.js' ],
      options : { reload: true }
    },
    express: {
      files   : [ '<%= paths.server.root %>/**/*.{js,json}' ],
      tasks   : [ 'express:dev', 'wait' ],
      options : {
        nospawn : true // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
      }
    }
  });

  grunt.registerTask('build:dev', [ 'clean:dev', 'webpack:dev' ]);
  grunt.registerTask('serve:dev', [ 'build:dev', 'express:dev', 'wait', 'watch' ]);

};
