'use strict';

var config     = require('config');
var BB         = require('bluebird');
var mongoose   = require('mongoose');
var jwt        = require('jsonwebtoken');
var redis      = require('redis');
var fs         = require('fs');

BB.promisifyAll(mongoose.Model);
BB.promisifyAll(mongoose.Model.prototype);
BB.promisifyAll(mongoose.Query.prototype);

BB.promisifyAll(jwt);
BB.promisifyAll(redis.RedisClient.prototype);
BB.promisifyAll(fs);

if (config.env === config.environments.test){
  BB.promisifyAll(require('supertest'));
}
