'use strict';

var _                     = require('lodash');
var Bluebird              = require('bluebird');
var mongoose              = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Settings              = require('../../settings');
var validations           = require('./validations');

var schema = new mongoose.Schema({
  email: {
    type      : String,
    lowercase : true
    //unique    : UserErrors.email.unique,
  }
});

// passport-local-mongoose plugin
schema.plugin(passportLocalMongoose, {
  usernameField          : 'email',
  missingUsernameError   : Settings.User.errors.email.required,
  missingPasswordError   : Settings.User.errors.passwordMissing,
  userExistsError        : Settings.User.errors.email.unique,
  incorrectPasswordError : Settings.User.errors.incorrectPassword
});

schema.plugin(validations);

var transform = function(doc, ret, options){
  return _.pick(ret, Settings.User.paths);
};

schema.set('toJSON',   { transform: transform });
schema.set('toObject', { transform: transform });

// Promisify passport-local-mongoose plugin statics
Bluebird.promisifyAll(schema.statics);
Bluebird.promisifyAll(schema.methods);

module.exports = schema;
