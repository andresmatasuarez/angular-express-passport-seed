/* eslint no-unused-vars: [2, { "args": "none" }] */
'use strict';

const config          = require('config');
const express         = require('express');
const Response        = require('simple-response');
const BadRequestError = require('passport-local-mongoose/lib/badrequesterror');
const RouteUtils      = require('../utils/route_utils');

module.exports = function() {

  const api = express();

  api.use(RouteUtils.enforceSSL({ port: config.server.ssl.port }));

  api.use('/settings', require('./settings'));
  api.use('/auth',     require('./auth'));
  api.use('/users',    require('./users'));

  api.use(RouteUtils.handleError(BadRequestError, (err, req, res, next) => {
    Response.BadRequest(res)(err);
  }));

  // Default error handler
  api.use((err, req, res, next) => {
    Response.InternalServerError(res)(err);
  });

  return api;

};
