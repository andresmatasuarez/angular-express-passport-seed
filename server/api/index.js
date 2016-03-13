/* eslint no-unused-vars: [2, { "args": "none" }] */

import config          from 'config';
import express         from 'express';
import BadRequestError from 'passport-local-mongoose/lib/badrequesterror';
import ValidationError from 'mongoose/lib/error/validation';
import CastError       from 'mongoose/lib/error/cast';
import Response        from 'simple-response';
import Log             from '../utils/log';
import RouteUtils      from '../utils/route_utils';
import settingsRouter  from './settings';
import authRouter      from './auth';
import adminsRouter    from './admins';
import { Auth } from '../middlewares';

// http://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify
function objectifyError(err) {
  return JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
}

export default function apiRouter() {
  const api = express();

  api.use(RouteUtils.enforceSSL({ port: config.server.ssl.port }));

  api.use('/settings', settingsRouter());
  api.use('/auth',     authRouter());
  api.use('/admins',   Auth.ensureAuthenticated(), adminsRouter());

  // Log errors
  api.use((err, req, res, next) => {
    Log.error(objectifyError(err));
    next(err);
  });

  api.use(RouteUtils.handleError(RouteUtils.InvalidIdError, (err, req, res, next) => {
    Response.BadRequest(res)(err);
  }));

  api.use(RouteUtils.handleError(RouteUtils.DocumentNotFoundError, (err, req, res, next) => {
    Response.NotFound(res)(err);
  }));

  api.use(RouteUtils.handleError(RouteUtils.ForbiddenError, (err, req, res, next) => {
    Response.Forbidden(res)(err);
  }));

  api.use(RouteUtils.handleError(BadRequestError, (err, req, res, next) => {
    Response.BadRequest(res)(err);
  }));

  api.use(RouteUtils.handleError(ValidationError, (err, req, res, next) => {
    Response.BadRequest(res)(err);
  }));

  api.use(RouteUtils.handleError(CastError, (err, req, res, next) => {
    Response.BadRequest(res)(err);
  }));

  // Default error handler
  api.use((err, req, res, next) => {
    Response.InternalServerError(res)(objectifyError(err));
  });

  return api;
}
