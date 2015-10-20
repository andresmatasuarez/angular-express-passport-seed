'use strict';

var config     = require('config');
var path       = require('path');
var express    = require('express');
var fs         = require('fs');
var favicon    = require('serve-favicon');
var RouteUtils = require('../utils/route_utils');

var enforceSSL = RouteUtils.enforceSSL({ port: config.server.ssl.port });

var apiRoute = function(resource){
  return path.join(config.app.api.base, resource).replace(/\\/g, '/');
};

var serveBundledIndex = function(page, bundleMappingsPath){
  return function(req, res, next){
    fs.readFileAsync(bundleMappingsPath)
    .then(JSON.parse)
    .then(function(mappings){
      res.render('index', {
        settings : config.app[page],
        scripts  : {
          commons : mappings.commons.js,
          app     : mappings[page].js
        }
      });
    })
    .catch(next);
  };
};

exports.applyTo = function(app){

  if (config.app.favicon){
    app.use(favicon(path.join(__dirname, config.app.favicon)));
  } else {
    app.use('favicon.ico', function(req, res){
      res.status(200);
      res.type('image/x-icon');
    });
  }

  // Secured content
  app.use(config.app.dashboard.base, enforceSSL);
  app.use(config.app.api.base,       enforceSSL);

  // Serve assets
  app.use('/', express.static(config.app.assets.path, {
    etag   : true,
    maxage : config.app.assets.max_age,
    index  : false
  }));

  app.use('/dashboard', serveBundledIndex('dashboard', config.app.assets.mappings));
  app.use('/web',       serveBundledIndex('web',       config.app.assets.mappings));

  // URL rewrite for non-HTML5 browsers
  // Just send the index.html for other files to support HTML5Mode
  // app.all(config.app.dashboard.base + '*', function(req, res, next){
  //   res.sendFile(config.app.dashboard.index, { root: path.join(__dirname, config.app.dashboard.root) });
  // });

  // app.all(config.app.web.base + '*', function(req, res, next){
  //   res.sendFile(config.app.web.index, { root: path.join(__dirname, config.app.web.root) });
  // });

  // API
  app.use(apiRoute('settings'), require('../routes/api/settings'));
  app.use(apiRoute('auth'),     require('../routes/api/auth'));
  app.use(apiRoute('users'),    require('../routes/api/users'));

};
