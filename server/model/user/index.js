'use strict';

var mongoose = require('mongoose');
var schema   = require('./schema');

module.exports = mongoose.model('User', schema);
