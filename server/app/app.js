'use strict';

var _          = require('lodash');
var config     = require('config');
var fs         = require('fs');
var https      = require('https');
var express    = require('express');
var Mongootils = require('mongootils');
var AppConfig  = require('./app_config');
var AppErrors  = require('./app_errors');
var AppRoutes  = require('./app_routes');

var serverHttp = express(); // HTTP server object
var serverHttps;            // HTTPS server object
var setupPromise;           // Setup singleton promise

// SSL support
if (config.server && config.server.ssl && config.server.ssl.enable){
  var sslOptions = {
    key  : fs.readFileSync(config.server.ssl.key),
    cert : fs.readFileSync(config.server.ssl.certificate)
  };

  if (!_.isEmpty(config.server.ssl.passphrase)){
    sslOptions.passphrase = config.server.ssl.passphrase;
  }

  serverHttps = https.createServer(sslOptions, serverHttp);
}

// Promise that is resolved when app has been successfully setup and rejected otherwise.
function _setup(){
  if (!setupPromise){
    setupPromise = new Mongootils(config.mongo.uri, config.mongo.options)
    .connect()
    .then(function(db){
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
