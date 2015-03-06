'use strict';

var config     = require('config');
var BB         = require('bluebird');
var mongoose   = require('mongoose');

BB.promisifyAll(mongoose.Model);
BB.promisifyAll(mongoose.Model.prototype);
BB.promisifyAll(mongoose.Query.prototype);

if (config.env === config.environments.test){
  BB.promisifyAll(require('supertest'));
}
