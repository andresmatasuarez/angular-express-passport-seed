'use strict';

var _            = require('lodash');
var BB           = require('bluebird');
var util         = require('util');
var uuid         = require('node-uuid');
var jwt          = require('jsonwebtoken');
var RedisService = require('../utils/redis_service');

var SECOND = 1000;

var JWTRedisServiceError = function JWTRedisServiceError(message){
  Error.call(this);
  this.name    = 'JWTRedisServiceError';
  this.message = message;
};

var UnauthorizedAccessError = function UnauthorizedAccessError(message){
  Error.call(this);
  this.name    = 'UnauthorizedAccessError';
  this.message = message || 'Token verification failed. User not authenticated or token expired.';
};

var NoTokenProvidedError = function NoTokenProvidedError(message){
  Error.call(this);
  this.name    = 'NoTokenProvidedError';
  this.message = message || 'No token provided.';
};

util.inherits(JWTRedisServiceError,    Error);
util.inherits(UnauthorizedAccessError, Error);
util.inherits(NoTokenProvidedError,    Error);

var JWTRedisService = function JWTRedisService(config){
  this.client = RedisService.createClient({
    host : config.host,
    port : config.port,
    pass : config.pass
  });

  this.issuer     = config.issuer;
  this.secret     = config.secret;
  this.keyspace   = config.keyspace;
  this.expiration = config.expiration;
};

JWTRedisService.prototype.sign = function(data){
  var jti = uuid.v4();

  var token = jwt.sign({ jti: jti }, this.secret, {
    issuer           : this.issuer,
    expiresInSeconds : this.expiration / SECOND
  });

  return this.client.psetexAsync(this.keyspace + jti, this.expiration, JSON.stringify(data))
  .then(function(reply){
    if (!reply){
      throw new JWTRedisServiceError('Session could not be stored in Redis');
    }
  })
  .thenReturn(token);

};

JWTRedisService.prototype.verify = function(token){
  if (_.isEmpty(token)){
    return BB.reject(new NoTokenProvidedError());
  }

  return jwt.verifyAsync(token, this.secret)
  .catch(function(err){
    throw new UnauthorizedAccessError();
  })
  .then(function(decoded){
    if (_.isEmpty(decoded.jti)){
      throw new UnauthorizedAccessError();
    }
    return this.client.getAsync(this.keyspace + decoded.jti)
    .then(function(data){
      if (_.isEmpty(data)){
        throw new UnauthorizedAccessError();
      }

      return [ decoded.jti, data ];
    });
  }.bind(this));
};

JWTRedisService.prototype.expire = function(token){
  if (_.isEmpty(token)){
    return BB.resolve();
  }

  var data = jwt.decode(token, this.secret);

  if (_.isEmpty(data) || _.isEmpty(data.jti)){
    return BB.resolve();
  }

  return this.client.delAsync(this.keyspace + data.jti);
};

JWTRedisService.JWTRedisServiceError    = JWTRedisServiceError;
JWTRedisService.UnauthorizedAccessError = UnauthorizedAccessError;
JWTRedisService.NoTokenProvidedError    = NoTokenProvidedError;

module.exports = JWTRedisService;
