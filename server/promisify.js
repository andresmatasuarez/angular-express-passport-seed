'use strict';

var config     = require('config');
var BB         = require('bluebird');
var mongoose   = require('mongoose');
var jwt        = require('jsonwebtoken');
var bcrypt     = require('bcrypt');
var redis      = require('redis');

BB.promisifyAll(mongoose.Model);
BB.promisifyAll(mongoose.Model.prototype);
BB.promisifyAll(mongoose.Query.prototype);

BB.promisifyAll(jwt);
BB.promisifyAll(bcrypt);
BB.promisifyAll(redis.RedisClient.prototype);

if (config.env === config.environments.test){
  BB.promisifyAll(require('supertest'));
}
