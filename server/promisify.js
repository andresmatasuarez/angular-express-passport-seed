'use strict';

var config   = require('config');
var Bluebird = require('bluebird');
var mongoose = require('mongoose');
var jwt      = require('jsonwebtoken');
var redis    = require('redis');
var fs       = require('fs');

Bluebird.promisifyAll(mongoose.Model);
Bluebird.promisifyAll(mongoose.Model.prototype);
Bluebird.promisifyAll(mongoose.Query.prototype);

Bluebird.promisifyAll(jwt);
Bluebird.promisifyAll(redis.RedisClient.prototype);
Bluebird.promisifyAll(fs);

if (config.env === config.environments.test){
  Bluebird.promisifyAll(require('supertest'));
}
