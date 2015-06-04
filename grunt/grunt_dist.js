'use strict';

module.exports = function(grunt){

  grunt.config('express.dist', {
    options: {
      script: '<%= paths.dist.server %>/bin/web.js'
    }
  });

  // Renames files for browser caching purposes
  grunt.config('filerev.dist', {
    src: [
      '{<%= paths.dist.client %>,<%= paths.dist.bo %>}/{,*/}*.{js,css}',
      '{<%= paths.dist.client %>,<%= paths.dist.bo %>}/assets/images/{,*/}*.{png,jpg,jpeg,gif}',
      '{<%= paths.dist.client %>,<%= paths.dist.bo %>}/assets/fonts/*'
    ]
  });

  // Allow the use of non-minsafe AngularJS files. Automatically makes it
  // minsafe compatible so Uglify does not destroy the ng references
  grunt.config('ngAnnotate', {
    client: {
      files: [{
        expand : true,
        cwd    : '.tmp/<%= paths.client.root %>/concat',
        src    : '*/**.js',
        dest   : '.tmp/<%= paths.client.root %>/concat'
      }]
    },
    bo: {
      files: [{
        expand : true,
        cwd    : '.tmp/<%= paths.bo.root %>/concat',
        src    : '*/**.js',
        dest   : '.tmp/<%= paths.bo.root %>/concat'
      }]
    }
  });

  // Package all the html partials into a single javascript payload
  grunt.config('ngtemplates', {
    options: {
      htmlmin: {
        collapseBooleanAttributes     : true,
        collapseWhitespace            : true,
        removeAttributeQuotes         : true,
        removeEmptyAttributes         : true,
        removeRedundantAttributes     : true,
        removeScriptTypeAttributes    : true,
        removeStyleLinkTypeAttributes : true
      },
    },
    client: {
      options : { module: 'web', usemin: 'dist/client/javascripts/app.js' },
      cwd     : '.tmp/<%= paths.client.root %>',
      src     : [ '**/*.html' ],
      dest    : '.tmp/<%= paths.client.root %>/javascripts/templates.js'
    },
    bo: {
      options : { module: 'dashboard', usemin: 'dist/backoffice/javascripts/app.js' },
      cwd     : '.tmp/<%= paths.bo.root %>',
      src     : [ '**/*.html' ],
      dest    : '.tmp/<%= paths.bo.root %>/javascripts/templates.js'
    }
  });

  // Reads HTML for usemin blocks to enable smart builds that automatically
  // concat, minify and revision files. Creates configurations in memory so
  // additional tasks can operate on them
  grunt.config('useminPrepare', {
    client: {
      src: [ '<%= paths.client.root %>/index.html' ],
      options: {
        staging : '.tmp/<%= paths.client.root %>',
        dest    : '<%= paths.dist.client %>'
      }
    },
    bo: {
      src: [ '<%= paths.bo.root %>/index.html' ],
      options: {
        staging : '.tmp/<%= paths.bo.root %>',
        dest    : '<%= paths.dist.bo %>'
      }
    }
  });

  // Performs rewrites based on filerev and the useminPrepare configuration
  grunt.config('usemin', {
    clienthtml: {
      files   : { src: [ '<%= paths.dist.client %>/{,*/}*.html' ] },
      options : { type: 'html', assetsDirs: [ '<%= paths.dist.client %>', '<%= paths.dist.client %>/assets' ] }
    },
    clientcss: {
      files   : { src: [ '<%= paths.dist.client %>/{,*/}*.css' ] },
      options : { type: 'css', assetsDirs: [ '<%= paths.dist.client %>', '<%= paths.dist.client %>/assets' ] }
    },
    clientjs: {
      files   : { src: [ '<%= paths.dist.client %>/{,*/}*.js' ] },
      options : { assetsDirs: [ '<%= paths.dist.client %>', '<%= paths.dist.client %>/assets' ] }
    },
    bohtml: {
      files   : { src: [ '<%= paths.dist.bo %>/{,*/}*.html' ] },
      options : { type: 'html', assetsDirs: [ '<%= paths.dist.bo %>', '<%= paths.dist.bo %>/assets' ] }
    },
    bocss: {
      files   : { src: [ '<%= paths.dist.bo %>/{,*/}*.css' ] },
      options : { type: 'css', assetsDirs: [ '<%= paths.dist.bo %>', '<%= paths.dist.bo %>/assets' ] }
    },
    bojs: {
      files   : { src: [ '<%= paths.dist.bo %>/{,*/}*.js' ] },
      options : { assetsDirs: [ '<%= paths.dist.bo %>', '<%= paths.dist.bo %>/assets' ] }
    },
    options: {
      // This is so we update image references in our ng-templates
      patterns: {
        bojs: [
          [ /(images\/.*?\.(?:gif|jpeg|jpg|png))/gm, 'Update the JS to reference our revved images' ]
        ],
        clientjs: [
          [ /(assets\/images\/.*?\.(?:gif|jpeg|jpg|png))/gm, 'Update the JS to reference our revved images' ]
        ]
      }
    }
  });

  grunt.config('copy.dist', {
    files: [{
      expand : true,
      dot    : true,
      cwd    : '<%= paths.client.root %>',
      dest   : '<%= paths.dist.client %>',
      src    : [ 'index.html', 'assets/images/**/*' ]
    }, {
      expand : true,
      dot    : true,
      cwd    : '<%= paths.bo.root %>',
      dest   : '<%= paths.dist.bo %>',
      src    : [ 'index.html', 'assets/images/**/*' ]
    }, {
      expand : true,
      dest   : '<%= paths.dist.root %>',
      src    : [ 'Procfile', 'package.json', 'server/**/*' ]
    }, {
      // Font-awesome for client
      expand : true,
      cwd    : '<%= paths.bower_components %>/font-awesome',
      dest   : '<%= paths.dist.client %>',
      src    : [ 'fonts/**/*' ]
    }, {
      // Font-awesome for backoffice
      expand : true,
      cwd    : '<%= paths.bower_components %>/font-awesome',
      dest   : '<%= paths.dist.bo %>',
      src    : [ 'fonts/**/*' ]
    }, {
      // Glyphicons for client
      expand : true,
      cwd    : '<%= paths.bower_components %>/bootstrap',
      dest   : '<%= paths.dist.client %>',
      src    : [ 'fonts/**/*' ]
    }, {
      // Glyphicons for backoffice
      expand : true,
      cwd    : '<%= paths.bower_components %>/bootstrap',
      dest   : '<%= paths.dist.bo %>',
      src    : [ 'fonts/**/*' ]
    }]
  });

  grunt.config('clean.dist', {
    files: [{
      dot: true,
      src: [ '.tmp', '<%= paths.dist.root %>' ]
    }]
  });

  grunt.registerTask('build:dist', [
    'clean:dist',
    'concurrent:transpile',
    'injector',
    'wiredep:client',
    'wiredep:bo',
    'useminPrepare',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'filerev',
    'usemin'
  ]);

  grunt.registerTask('serve:dist', [ 'env:prod', 'build:dist', 'express:dist', 'express-keepalive' ]);

};
