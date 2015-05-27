'use strict';

var _               = require('lodash');
var config          = require('config');
var Response        = require('./response');
var JWTRedisService = require('../services/jwt_redis_service');
var User            = require('../model/user');

var jWTRedisService = new JWTRedisService(_.merge({
  issuer     : config.server.auth.issues,
  secret     : config.server.auth.token_secret,
  expiration : config.server.auth.expiration
}, config.redis));

module.exports = {

  authenticate: function(req, res, next){

    return User.findOneAsync({ email: req.body.email })
    .then(function(user){

      if (_.isEmpty(user)){
        return Response.Unauthorized(res)('Authentication failed.');
      }

      return user.verifyPassword(req.body.password)
      .then(function(matches){
        if (!matches){
          return Response.Unauthorized(res)('Authentication failed.');
        }
        return jWTRedisService.sign(user.toJSON());
      });
    })
    .then(function(token){
      return Response.Ok(res)({ message: 'Authentication successful!', token: token });
    })
    .catch(Response.InternalServerError(res));

  },

  ensureAuthenticated: function(req, res, next){
    return jWTRedisService.verify(req.token)
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

  logout: function(req, res, next){
    if (_.isEmpty(req.token)){
      return next();
    }

    return jWTRedisService.expire(req.token)
    .then(function(reply){
      delete req.token;
      delete req.session;
      next();
    })
    .catch(Response.InternalServerError(res));

  }

};
