'use strict';

const _          = require('lodash');
const config     = require('config');
const fs         = require('fs');
const https      = require('https');
const express    = require('express');
const Mongootils = require('mongootils');
const appConfig  = require('./app_config');
const appErrors  = require('./app_errors');
const appRoutes  = require('./app_routes');

const serverHttp = express(); // HTTP server object
let serverHttps;              // HTTPS server object
let setupPromise;             // Setup singleton promise

// SSL support
if (config.server && config.server.ssl && config.server.ssl.enable) {
  const sslOptions = {
    key  : fs.readFileSync(config.server.ssl.key),
    cert : fs.readFileSync(config.server.ssl.certificate)
  };

  if (!_.isEmpty(config.server.ssl.passphrase)) {
    sslOptions.passphrase = config.server.ssl.passphrase;
  }

  serverHttps = https.createServer(sslOptions, serverHttp);
}

// Promise that is resolved when app has been successfully setup and rejected otherwise.
function setup() {
  if (!setupPromise) {
    setupPromise = new Mongootils(config.mongo.uri, config.mongo.options)
    .connect()
    .then(() => {
      appConfig(serverHttp);
      appRoutes(serverHttp);
      appErrors(serverHttp);
    });
  }

  return setupPromise;
}

module.exports = {
  server: {
    http  : serverHttp,
    https : serverHttps
  },
  setup
};
