'use strict';

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

  grunt.config('watch', {
    injectJS: {
      files   : [ '.tmp/{<%= paths.client.root %>,<%= paths.bo.root %>}/javascripts/**/*.js' ],
      tasks   : [ 'injector:js' ],
      options : { event: [ 'added', 'deleted' ] }
    },
    injectCSS: {
      files   : [ '.tmp/{<%= paths.client.root %>,<%= paths.bo.root %>}/stylesheets/**/*.css' ],
      tasks   : [ 'injector:css' ],
      options : { event: [ 'added', 'deleted' ] }
    },

    lessClient: {
      files: [ '<%= paths.client.root %>/stylesheets/**/*.less' ],
      tasks: [ 'less:client' ]
    },
    lessBO: {
      files: [ '<%= paths.bo.root %>/stylesheets/**/*.less' ],
      tasks: [ 'less:bo' ]
    },

    coffeeClient: {
      files: [ '<%= paths.client.root %>/javascripts/**/*.coffee' ],
      tasks: [ 'coffee:client' ]
    },
    coffeeBO: {
      files: [ '<%= paths.bo.root %>/javascripts/**/*.coffee' ],
      tasks: [ 'coffee:bo' ]
    },

    jadeClient: {
      files: [ '<%= paths.client.root %>/**/*.jade' ],
      tasks: [ 'jade:client' ]
    },
    jadeBO: {
      files: [ '<%= paths.bo.root %>/**/*.jade' ],
      tasks: [ 'jade:bo' ]
    },

    gruntfile: {
      files   : [ 'Gruntfile.js', 'grunt/*.js' ],
      options : { reload: true }
    },
    wiredep: {
      files: [ 'bower.json' ],
      tasks: [ 'wiredep:client', 'wiredep:bo' ]
    },
    express: {
      files   : [ '<%= paths.server.root %>/**/*.{js,json}' ],
      tasks   : [ 'express:dev', 'wait' ],
      options : {
        livereload : true,
        nospawn    : true // Without this option specified express won't be reloaded
      }
    },
    livereload: {
      files: [
        '.tmp/{<%= paths.client.root %>,<%= paths.bo.root %>}/**/*.{js,css,html}',
        '{<%= paths.client.root %>,<%= paths.bo.root %>}/**/*.html',
        '{<%= paths.client.assets %>,<%= paths.bo.assets %>}/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
      ],
      options: { livereload: true }
    }
  });

  grunt.registerTask('build:dev', [
    'clean:dev',
    'concurrent:transpile',
    'injector',
    'wiredep:client',
    'wiredep:bo',
  ]);

  grunt.registerTask('serve:dev', [ 'build:dev', 'express:dev', 'wait', 'watch' ]);

};
