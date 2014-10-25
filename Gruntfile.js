'use strict';

var jit            = require('jit-grunt');
var time           = require('time-grunt');
var jshintStylish  = require('jshint-stylish');
var useminPatterns = require('usemin-patterns');
var cfg            = require('./server/config/default.js');

module.exports = function (grunt) {

  // Load grunt tasks automatically when needed.
  jit(grunt, {
    injector      : 'grunt-asset-injector',
    useminPrepare : 'grunt-usemin',
    express       : 'grunt-express-server',
    ngtemplates   : 'grunt-angular-templates'
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
        root   : 'backoffice',
        assets : 'backoffice/assets'
      },
      server: {
        root   : 'server'
      },
      dist: {
        root   : 'dist',
        client : 'dist/client',
        bo     : 'dist/backoffice',
        server : 'dist/server'
      },
      tests: {
        client : 'tests/client',
        bo     : 'tests/backoffice',
        server : 'tests/server'
      }
    },

    env: {
      dev  : {
        NODE_ENV: cfg.environments.development,
        NODE_CONFIG_DIR: './server/config'
      },
      test : {
        NODE_ENV: cfg.environments.test,
        NODE_CONFIG_DIR: './server/config'
      },
      prod : {
        NODE_ENV: cfg.environments.production,
        NODE_CONFIG_DIR: './server/config'
      }
    },

    express: {
      dev  : { options: { script: '<%= paths.server.root %>/bin/web.js', debug: true } },
      prod : { options: { script: '<%= paths.dist.server %>/bin/web.js' } }
    },

    jshint: {
      options: { reporter: jshintStylish },
      client: {
        options: { jshintrc: '<%= paths.client.root %>/.jshintrc' },
        src: [ '<%= paths.client.root %>/**/*.js' ]
      },
      bo: {
        options: { jshintrc: '<%= paths.bo.root %>/.jshintrc' },
        src: [ '<%= paths.bo.root %>/**/*.js' ]
      },
      boTests: {
        options: { jshintrc: '<%= paths.tests.bo %>/.jshintrc' },
        src: [ '<%= paths.tests.bo %>/**/*.spec.js' ]
      },
      server: {
        options: { jshintrc: '.jshintrc' },
        src: [ '<%= paths.server.root %>/**/*.js' ]
      },
      serverTests: {
        options: { jshintrc: '<%= paths.tests.server %>/.jshintrc' },
        src: [ '<%= paths.tests.server %>/**/*.spec.js' ]
      }
    },

    watch: {
      injectJS: {
        files: [ '.tmp/{<%= paths.client.root %>,<%= paths.bo.root %>}/javascripts/**/*.js' ],
        tasks: [ 'injector:js' ],
        options: {
          event: [ 'added', 'deleted' ]
        }
      },
      injectCSS: {
        files: [ '.tmp/{<%= paths.client.root %>,<%= paths.bo.root %>}/stylesheets/**/*.css' ],
        tasks: [ 'injector:css' ],
        options: {
          event: [ 'added', 'deleted' ]
        }
      },
      less: {
        files: [ '{<%= paths.client.root %>,<%= paths.bo.root %>}/stylesheets/**/*.less' ],
        tasks: [ 'less' ]
      },
      coffee: {
        files: [ '{<%= paths.client.root %>,<%= paths.bo.root %>}/javascripts/**/*.coffee' ],
        tasks: [ 'coffee' ]
      },
      jade: {
        files: [ '{<%= paths.client.root %>,<%= paths.bo.root %>}/**/*.jade' ],
        tasks: [ 'jade' ]
      },
      gruntfile: {
        files: [ 'Gruntfile.js' ]
      },
      livereload: {
        files: [
          '.tmp/{<%= paths.client.root %>,<%= paths.bo.root %>}/**/*.{js,css,html}',
          '{<%= paths.client.root %>,<%= paths.bo.root %>}/**/*.html',
          '{<%= paths.client.assets %>,<%= paths.bo.assets %>}/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          '<%= paths.server.root %>/**/*.{js,json}'
        ],
        tasks: [ 'express:dev', 'wait' ],
        options: {
          livereload: true,
          nospawn: true // Without this option specified express won't be reloaded
        }
      }
    },

    injector: {
      js: {
        options: {
          transform: function(filepath) {
            filepath = filepath.replace('/.tmp/client/', '');
            filepath = filepath.replace('/.tmp/backoffice/', '');
            return '<script src="' + filepath + '"></script>';
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
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
          starttag: '<!-- injector:css -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= paths.client.root %>/index.html' : [ '.tmp/<%= paths.client.root %>/stylesheets/**/*.css' ],
          '<%= paths.bo.root %>/index.html'     : [ '.tmp/<%= paths.bo.root %>/stylesheets/**/*.css' ]
        }
      }
    },

    concurrent: {
      preprocess: [ 'coffee', 'less', 'jade' ]
    },

    // Empties folders for a fresh start.
    clean: {
      all: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= paths.dist.root %>'
          ]
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngAnnotate: {
      client: {
        files: [{
          expand: true,
          cwd: '.tmp/<%= paths.client.root %>/concat',
          src: '*/**.js',
          dest: '.tmp/<%= paths.client.root %>/concat'
        }]
      },
      bo: {
        files: [{
          expand: true,
          cwd: '.tmp/<%= paths.bo.root %>/concat',
          src: '*/**.js',
          dest: '.tmp/<%= paths.bo.root %>/concat'
        }]
      }
    },

    // Package all the html partials into a single javascript payload
    ngtemplates: {
      options: {
        // This should be the name of your apps angular module
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
      },
      client: {
        options: { module: 'web', usemin: 'dist/client/javascripts/app.js' },
        cwd: '.tmp/<%= paths.client.root %>',
        src: [ '**/*.html' ],
        dest: '.tmp/<%= paths.client.root %>/javascripts/templates.js'
      },
      bo: {
        options: { module: 'dashboard', usemin: 'dist/backoffice/javascripts/app.js' },
        cwd: '.tmp/<%= paths.bo.root %>',
        src: [ '**/*.html' ],
        dest: '.tmp/<%= paths.bo.root %>/javascripts/templates.js'
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '{<%= paths.dist.client %>,<%= paths.dist.bo %>}/{,*/}*.{js,css}',
          '{<%= paths.dist.client %>,<%= paths.dist.bo %>}/assets/images/{,*/}*.{png,jpg,jpeg,gif}',
          '{<%= paths.dist.client %>,<%= paths.dist.bo %>}/assets/fonts/*'
        ]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      client: {
        src: '<%= paths.client.root %>/index.html',
        //ignorePath: '..',
        // exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap.css/, /font-awesome.css/ ]
      },
      bo: {
        src: '<%= paths.bo.root %>/index.html'
      },
      karma: {
        src: 'karma.conf.js',
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
      }
    },

    less: {
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
    },

    coffee: {
      options: {
        sourceMap: true,
        sourceRoot: ''
      },
      client: {
        files: [{
          expand: true,
          src: '<%= paths.client.root %>/javascripts/**/*.coffee',
          dest: '.tmp',
          ext: '.js'
        }]
      },
      bo: {
        files: [{
          expand: true,
          src: '<%= paths.bo.root %>/javascripts/**/*.coffee',
          dest: '.tmp',
          ext: '.js'
        }]
      }
    },

    jade: {
      options: {
        data: {
          debug: false
        }
      },
      client: {
        files: [{
          expand: true,
          cwd: '<%= paths.client.root %>',
          src: [ '**/*.jade' ],
          dest: '.tmp/<%= paths.client.root %>',
          ext: '.html'
        }]
      },
      bo: {
        files: [{
          expand: true,
          cwd: '<%= paths.bo.root %>',
          src: [ '**/*.jade' ],
          dest: '.tmp/<%= paths.bo.root %>',
          ext: '.html'
        }]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      client: {
        src: [ '<%= paths.client.root %>/index.html' ],
        options: {
          staging: '.tmp/<%= paths.client.root %>',
          dest: '<%= paths.dist.client %>'
        }
      },
      bo: {
        src: [ '<%= paths.bo.root %>/index.html' ],
        options: {
          staging: '.tmp/<%= paths.bo.root %>',
          dest: '<%= paths.dist.bo %>'
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      clienthtml: {
        files: { src: [ '<%= paths.dist.client %>/{,*/}*.html' ] },
        options: { type: 'html', assetsDirs: [ '<%= paths.dist.client %>', '<%= paths.dist.client %>/assets' ] }
      },
      clientcss: {
        files: { src: [ '<%= paths.dist.client %>/{,*/}*.css' ] },
        options: { type: 'css', assetsDirs: [ '<%= paths.dist.client %>', '<%= paths.dist.client %>/assets' ] }
      },
      clientjs: {
        files: { src: [ '<%= paths.dist.client %>/{,*/}*.js' ] },
        options: { assetsDirs: [ '<%= paths.dist.client %>', '<%= paths.dist.client %>/assets' ] }
      },
      bohtml: {
        files: { src: [ '<%= paths.dist.bo %>/{,*/}*.html' ] },
        options: { type: 'html', assetsDirs: [ '<%= paths.dist.bo %>', '<%= paths.dist.bo %>/assets' ] }
      },
      bocss: {
        files: { src: [ '<%= paths.dist.bo %>/{,*/}*.css' ] },
        options: { type: 'css', assetsDirs: [ '<%= paths.dist.bo %>', '<%= paths.dist.bo %>/assets' ] }
      },
      bojs: {
        files: { src: [ '<%= paths.dist.bo %>/{,*/}*.js' ] },
        options: { assetsDirs: [ '<%= paths.dist.bo %>', '<%= paths.dist.bo %>/assets' ] }
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
    },

    // // Performs rewrites based on filerev and the useminPrepare configuration
    // usemin: {
    //   html : [ '<%= paths.dist.client %>/{,*/}*.html' ],
    //   css  : [ '<%= paths.dist.client %>/{,*/}*.css' ],
    //   js   : [ '<%= paths.dist.client %>/{,*/}*.js' ],
    //   options: {
    //     assetsDirs: [ '<%= paths.dist.client %>' ],
    //     // This is so we update image references in our ng-templates
    //     patterns: {
    //       js: useminPatterns.js
    //     }
    //   }
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= paths.client.root %>',
          dest: '<%= paths.dist.client %>',
          src: [
            'index.html',
            'assets/images/**/*'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '.tmp/<%= paths.client.root %>',
          dest: '<%= paths.dist.client %>',
          src: [
            '**/*.html'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '<%= paths.bo.root %>',
          dest: '<%= paths.dist.bo %>',
          src: [
            'index.html',
            'assets/images/**/*'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '.tmp/<%= paths.bo.root %>',
          dest: '<%= paths.dist.bo %>',
          src: [
            '**/*.html'
          ]
        }, {
          expand: true,
          dest: '<%= paths.dist.root %>',
          src: [
            'Procfile',
            'package.json',
            'server/**/*'
          ]
        }, {
          // Font-awesome
          expand: true,
          cwd: '<%= paths.bower_components %>/font-awesome',
          dest: '<%= paths.dist.client %>',
          src: [
            'fonts/**/*'
          ]
        }]
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec',
      },
      src: [ '<%= paths.tests.server %>/**/*.spec.js' ]
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
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

  grunt.registerTask('serve', function (target) {
    switch(target){
      case 'dist':
        return grunt.task.run([
          'env:prod',
          'build',
          'express:prod',
          'wait',
          'express-keepalive'
        ]);

      default:
        return grunt.task.run([
          'env:dev',
          'clean:all',
          'concurrent:preprocess',
          'injector',
          'wiredep',
          'express:dev',
          'wait',
          'watch'
        ]);
    }
  });

  grunt.registerTask('test', function(target) {
    switch(target){
      case 'server':
        return grunt.task.run([
          'env:test',
          'jshint:serverTests',
          'mochaTest'
        ]);

      case 'bo':
        return grunt.task.run([
          'env:test',
          'jshint:boTests',
          'wiredep:karma',
          'karma'
        ]);

      default:
        return grunt.task.run([ 'test:server', 'test:bo' ]);
    }
  });

  grunt.registerTask('build', [
    'clean:all',
    'concurrent:preprocess',
    'injector:css',
    'injector:js',
    'wiredep',
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

};
