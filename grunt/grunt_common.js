'use strict';

module.exports = function(grunt){

  grunt.config('wiredep.client', {
    src: '<%= paths.client.root %>/index.html',
    // ignorePath: '..',
    // exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap.css/, /font-awesome.css/ ]
  });

  grunt.config('wiredep.bo', {
    src: '<%= paths.bo.root %>/index.html'
  });

  grunt.config('injector', {
    js: {
      options: {
        transform: function(filepath) {
          filepath = filepath.replace('/.tmp/client/', '');
          filepath = filepath.replace('/.tmp/backoffice/', '');
          return '<script src="' + filepath + '"></script>';
        },
        starttag : '<!-- injector:js -->',
        endtag   : '<!-- endinjector -->'
      },
      files: {
        '<%= paths.client.root %>/index.html' : [ '.tmp/<%= paths.client.root %>/javascripts/**/*.js' ],
        '<%= paths.bo.root %>/index.html'     : [ '.tmp/<%= paths.bo.root %>/javascripts/**/*.js' ]
      }
    },

    css: {
      options: {
        transform: function(filepath) {
          filepath = filepath.replace('/.tmp/client/', '');
          filepath = filepath.replace('/.tmp/backoffice/', '');
          return '<link rel="stylesheet" href="' + filepath + '">';
        },
        starttag : '<!-- injector:css -->',
        endtag   : '<!-- endinjector -->'
      },
      files: {
        '<%= paths.client.root %>/index.html' : [ '.tmp/<%= paths.client.root %>/stylesheets/**/*.css' ],
        '<%= paths.bo.root %>/index.html'     : [ '.tmp/<%= paths.bo.root %>/stylesheets/**/*.css' ]
      }
    }
  });

  grunt.config('coffee', {
    options: {
      sourceMap  : true,
      sourceRoot : ''
    },
    client: {
      files: [{
        expand : true,
        src    : '<%= paths.client.root %>/javascripts/**/*.coffee',
        dest   : '.tmp',
        ext    : '.js'
      }]
    },
    bo: {
      files: [{
        expand : true,
        src    : '<%= paths.bo.root %>/javascripts/**/*.coffee',
        dest   : '.tmp',
        ext    : '.js'
      }]
    }
  });

  grunt.config('less', {
    client: {
      paths: [ '<%= paths.client.root %>/stylesheets' ],
      files: [{
        expand : true,
        dest   : '.tmp',
        ext    : '.css',
        src    : [ '<%= paths.client.root %>/stylesheets/**/*.less' ]
      }]
    },
    bo: {
      paths: [ '<%= paths.bo.root %>/stylesheets' ],
      files: [{
        expand : true,
        dest   : '.tmp',
        ext    : '.css',
        src    : [ '<%= paths.bo.root %>/stylesheets/**/*.less' ]
      }],
    }
  });

  grunt.config('jade', {
    options: {
      data: {
        debug: false
      }
    },
    client: {
      files: [{
        expand : true,
        cwd    : '<%= paths.client.root %>',
        src    : [ '**/*.jade' ],
        dest   : '.tmp/<%= paths.client.root %>',
        ext    : '.html'
      }]
    },
    bo: {
      files: [{
        expand : true,
        cwd    : '<%= paths.bo.root %>',
        src    : [ '**/*.jade' ],
        dest   : '.tmp/<%= paths.bo.root %>',
        ext    : '.html'
      }]
    }
  });

  grunt.config('concurrent.transpile', [ 'coffee', 'less', 'jade' ]);

};
