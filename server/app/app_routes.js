'use strict';

var config     = require('config');
var path       = require('path');
var express    = require('express');
var RouteUtils = require('../utils/route_utils');

var enforceSSL = RouteUtils.enforceSSL({ port: config.server.ssl.port });

var apiRoute = function(resource){
  return path.join(config.app.api.base, resource).replace(/\\/g, '/');
};

exports.applyTo = function(app){

  // Secured content
  app.use(config.app.backoffice.base, enforceSSL);
  app.use(config.app.api.base       , enforceSSL);

  // Static content
  app.use(config.app.client.base    , express.static(path.join(__dirname, config.app.client.root)));
  app.use(config.app.backoffice.base, express.static(path.join(__dirname, config.app.backoffice.root)));

  if(config.env !== config.environments.production){
    app.use(require('connect-livereload')());
    app.use(config.app.client.base    , express.static(path.join(__dirname, config.app.client.tmp)));
    app.use(config.app.backoffice.base, express.static(path.join(__dirname, config.app.backoffice.tmp)));
    app.use('/bower_components'       , express.static(path.join(__dirname, config.app.dependencies.frontend)));
  }

  // API
  app.use(apiRoute('auth'),  require('../routes/api/auth'));
  app.use(apiRoute('users'), require('../routes/api/users'));

};
