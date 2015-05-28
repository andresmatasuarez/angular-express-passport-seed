'use strict';

var config          = require('config');
var passport        = require('passport');
var Response        = require('../utils/response');
var JWTRedisService = require('../services/jwt_redis_service');

var jwtRedisService = new JWTRedisService({
  host       : config.redis.host,
  port       : config.redis.port,
  issuer     : config.server.auth.issues,
  secret     : config.server.auth.token_secret,
  expiration : config.server.auth.expiration
});

module.exports = {

  ensureAuthenticated: function(req, res, next){
    return jwtRedisService.verify(req.token)
    .spread(function(jti, user){
      req.session = {
        jti  : jti,
        user : JSON.parse(user)
      };
      next();
    })
    .catch(JWTRedisService.NoTokenProvidedError, JWTRedisService.UnauthorizedAccessError, Response.Unauthorized(res))
    .catch(Response.InternalServerError(res));

  },

  authenticate: function(req, res, next){
    passport.authenticate('local', { session: false }, function(err, user, info){
      if (err){
        return Response.InternalServerError(res)(err);
      }

      if (!user){
        return Response.Unauthorized(res)(info);
      }

      req.login(user, function(err){
        if (err){
          return Response.InternalServerError(res)(err);
        }

        next();

      });

    })(req, res, next);
  },

  login: function(req, res, next){
    var user = req.user.toJSON();
    return jwtRedisService.sign(user)
    .then(function(token){
      return {
        message : 'Authentication successful!',
        token   : token,
        user    : user
      };
    })
    .then(Response.Ok(res))
    .catch(Response.InternalServerError(res));

  },

  logout: function(req, res, next){
    if (!req.token){
      return next();
    }

    return jwtRedisService.expire(req.token)
    .then(function(reply){
      delete req.token;
      delete req.session;
      delete req.user;
    })
    .then(Response.NoContent(res))
    .catch(Response.InternalServerError(res));

  }

};
