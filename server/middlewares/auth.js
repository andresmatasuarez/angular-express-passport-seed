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
  secret     : config.server.auth.tokenSecret,
  expiration : config.server.auth.expiration
});

module.exports = {

  ensureAuthenticated() {
    return (req, res, next) => {
      const token = req.cookies['seed_jwt'];
      return jwtRedisService.verify(token)
      .spread((jti, user) => {
        req.auth = {
          jti,
          user: JSON.parse(user)
        };
        next();
      })
      .catch(JWTRedisService.NoTokenProvidedError, JWTRedisService.UnauthorizedAccessError, Response.Unauthorized(res))
      .catch(Response.InternalServerError(res));

    };
  },

  authenticate() {
    return (req, res, next) => {
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
    };
  },

  login() {
    return (req, res) => {
      const user = req.user.toJSON();
      return jwtRedisService.sign(user)
      .then((token) => {
        res.cookie('seed_jwt', token, {
          httpOnly : true,
          secure   : true,
          path     : '/',
          maxAge   : 1000 * 60 * 24 // 24 hours
        });
        Response.Ok(res)('Authentication successful.');
      })
      .catch(Response.InternalServerError(res));
    };
  },

  logout() {
    return (req, res) => {
      const token = req.cookies['seed_jwt'];
      if (!token) {
        return Response.NoContent(res)();
      }

      return jwtRedisService.expire(token)
      .then(() => {
        res.clearCookie('seed_jwt');
        Response.Ok(res)('Sucessfully signed out.');
      })
      .catch(Response.InternalServerError(res));

    };
  }

};
