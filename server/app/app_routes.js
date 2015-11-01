'use strict';

const config     = require('config');
const path       = require('path');
const express    = require('express');
const fs         = require('fs');
const favicon    = require('serve-favicon');
const RouteUtils = require('../utils/route_utils');
const api        = require('../api');

const enforceSSL = RouteUtils.enforceSSL({ port: config.server.ssl.port });

function serveBundledIndex(page, bundleMappingsPath) {
  return function(req, res, next) {
    fs.readFileAsync(bundleMappingsPath)
    .then(JSON.parse)
    .then(function(mappings) {
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
}

module.exports = function(app) {

  if (config.app.favicon) {
    app.use(favicon(path.join(__dirname, config.app.favicon)));
  } else {
    app.use('favicon.ico', function(req, res) {
      res.status(200);
      res.type('image/x-icon');
    });
  }

  // Secured content
  app.use(config.app.dashboard.base, enforceSSL);

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
  // app.all(config.app.dashboard.base + '*', function(req, res, next) {
  //   res.sendFile(config.app.dashboard.index, { root: path.join(__dirname, config.app.dashboard.root) });
  // });

  // app.all(config.app.web.base + '*', function(req, res, next) {
  //   res.sendFile(config.app.web.index, { root: path.join(__dirname, config.app.web.root) });
  // });

  // API
  app.use(config.app.api.base, api());

};
