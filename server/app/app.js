'use strict';

var _         = require('lodash');
var config    = require('config');
var fs        = require('fs');
var https     = require('https');
var express   = require('express');
var db        = require('../utils/db');
var AppConfig = require('./app_config');
var AppErrors = require('./app_errors');
var AppRoutes = require('./app_routes');

var sslOptions = {
  key  : fs.readFileSync(config.server.ssl.key),
  cert : fs.readFileSync(config.server.ssl.certificate)
};

if (!_.isEmpty(config.server.ssl.passphrase)){
  if (fs.existsSync(config.server.ssl.passphrase)){
    sslOptions.passphrase = fs.readFileSync(config.server.ssl.passphrase).toString().trim();
  }
}

// HTTP server object
var serverHttp = express();

// HTTPS server object
var serverHttps = https.createServer(sslOptions, serverHttp);

// Setup singleton promise
var setupPromise;

// Promise that is resolved when app has been successfully setup and rejected otherwise.
function _setup(){
  if (!setupPromise){
    setupPromise = db.connect()
    .then(function(){
      AppConfig.applyTo(serverHttp);
      AppRoutes.applyTo(serverHttp);
      AppErrors.applyTo(serverHttp);
    });
  }

  return setupPromise;
}

module.exports = {
  server: {
    http  : serverHttp,
    https : serverHttps,
  },
  setup: _setup
};
