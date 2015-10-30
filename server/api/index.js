'use strict';

const config = require('config');
const express = require('express');
const RouteUtils = require('../utils/route_utils');

module.exports = function() {

  const api = express();

  api.use(RouteUtils.enforceSSL({ port: config.server.ssl.port }));

  api.use('/settings', require('./settings'));
  api.use('/auth',     require('./auth'));
  api.use('/users',    require('./users'));

  return api;

};
