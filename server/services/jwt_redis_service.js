'use strict';

var _            = require('lodash');
var BB           = require('bluebird');
var util         = require('util');
var redis        = require('redis');
var uuid         = require('node-uuid');
var jwt          = require('jsonwebtoken');
var RedisService = require('../utils/redis_service');

var MINUTE = 60 * 1000;

var JWTRedisServiceError = function(message){
  this.name    = 'JWTRedisServiceError';
  this.message = message;
};

var UnauthorizedAccessError = function(message){
  this.name    = 'UnauthorizedAccessError';
  this.message = message;
};

var NoTokenProvidedError = function(){
  this.name    = 'NoTokenProvidedError';
  this.message = 'No token provided';
};

util.inherits(JWTRedisServiceError,    Error);
util.inherits(UnauthorizedAccessError, Error);
util.inherits(NoTokenProvidedError,    Error);

var JWTRedisService = function(config){

  var client = RedisService.createClient(config);

  return {

    sign: function(user){
      var jti = uuid.v4();

      // Do not set 'expiresInMinutes' when signing as we are relying on Redis TTL policy to handle token validation.
      var token = jwt.sign({ jti: jti }, config.secret, {
        issuer           : config.issuer,
        expiresInMinutes : config.expiration / MINUTE
      });

      return client.setexAsync(config.keyspace + jti, config.expiration / 1000, JSON.stringify(user.toJSON()))
      .then(function(reply){
        if (!reply){
          throw new JWTRedisServiceError('Session could not be stored in Redis');
        }
      })
      .thenReturn(token);
    },

    verify: function(token){
      return BB.resolve()
      .then(function(){
        if (_.isEmpty(token)){
          throw new NoTokenProvidedError();
        }

        return jwt.verifyAsync(token, config.secret)
        .catch(function(err){
          throw new UnauthorizedAccessError('Token verification failed.');
        });
      })
      .then(function(decoded){
        if (_.isEmpty(decoded.jti)){
          throw new UnauthorizedAccessError('Token verification failed.');
        }
        return client.getAsync(config.keyspace + decoded.jti);
      })
      .then(function(user){
        if (_.isEmpty(user)){
          throw new UnauthorizedAccessError('User not authenticated or token expired.');
        }
        return user;
      });
    },

    expire: function(token){
      return jwt.verifyAsync(token, config.secret)
      .catch(function(err){
        throw new UnauthorizedAccessError('Token verification failed.');
      })
      .then(function(decoded){
        if (_.isEmpty(decoded.jti)){
          throw new UnauthorizedAccessError('Token verification failed.');
        }

        return client.delAsync(config.keyspace + decoded.jti);
      });
    }

  };

};

JWTRedisService.JWTRedisServiceError    = JWTRedisServiceError;
JWTRedisService.UnauthorizedAccessError = UnauthorizedAccessError;
JWTRedisService.NoTokenProvidedError    = NoTokenProvidedError;

module.exports = JWTRedisService;
