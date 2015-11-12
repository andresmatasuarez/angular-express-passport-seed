'use strict';

module.exports = function(grunt) {

  grunt.config('express.dev', {
    options: {
      script : '<%= paths.dev.server %>/bin/web.js',
      debug  : true
    }
  });

  grunt.config('clean.dev', {
    files: [{
      dot : true,
      src : [ 'bundle' ]
    }]
  });

  grunt.config('webpack.dev', {});

  grunt.config('watch', {
    assets: {
      files   : [ '<%= paths.dev.assets %>/**/*.{coffee,less,jade}' ],
      tasks   : [ 'build:dev' ],
      options : { spawn: false }
    },
    gruntfile: {
      files   : [ 'Gruntfile.js', 'grunt/*.js' ],
      options : { reload: true }
    },
    express: {
      files   : [ '<%= paths.dev.server %>/**/*.{js,json}' ],
      tasks   : [ 'express:dev', 'wait' ],
      options : {
        nospawn : true // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
      }
    }
  });

  grunt.registerTask('build:dev', [ 'clean:dev', 'webpack:dev' ]);
  grunt.registerTask('serve:dev', [ 'build:dev', 'express:dev', 'wait', 'watch' ]);

};
