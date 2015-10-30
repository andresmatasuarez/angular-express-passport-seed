'use strict';

const config          = require('config');
const passport        = require('passport');
const Response        = require('simple-response');
const JWTRedisService = require('../services/jwt_redis_service');

const jwtRedisService = new JWTRedisService({
  host       : config.redis.host,
  port       : config.redis.port,
  pass       : config.redis.pass,
  issuer     : config.server.auth.issues,
  secret     : config.server.auth.token_secret,
  expiration : config.server.auth.expiration
});

module.exports = {

  ensureAuthenticated(req, res, next) {
    return jwtRedisService.verify(req.token)
    .spread((jti, user) => {
      req.session = {
        jti,
        user: JSON.parse(user)
      };
      next();
    })
    .catch(JWTRedisService.NoTokenProvidedError, JWTRedisService.UnauthorizedAccessError, Response.Unauthorized(res))
    .catch(Response.InternalServerError(res));

  },

  authenticate(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return Response.InternalServerError(res)(err);
      }

      if (!user) {
        return Response.Unauthorized(res)(info);
      }

      req.login(user, { session: false }, err2 => {
        if (err2) {
          return Response.InternalServerError(res)(err2);
        }

        next();

      });

    })(req, res, next);
  },

  login(req, res) {
    const user = req.user.toJSON();
    return jwtRedisService.sign(user)
    .then((token) => {
      return {
        message: 'Authentication successful!',
        token,
        user
      };
    })
    .then(Response.Ok(res))
    .catch(Response.InternalServerError(res));

  },

  logout(req, res) {
    if (!req.token) {
      return Response.NoContent(res)();
    }

    return jwtRedisService.expire(req.token)
    .then(() => {
      delete req.token;
      delete req.session;
      delete req.user;
    })
    .then(Response.NoContent(res))
    .catch(Response.InternalServerError(res));

  }

};
