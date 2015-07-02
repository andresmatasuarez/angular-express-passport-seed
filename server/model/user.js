'use strict';

var _                     = require('lodash');
var BB                    = require('bluebird');
var util                  = require('util');
var config                = require('config');
var mongoose              = require('mongoose');
var validator             = require('validator');
var passportLocalMongoose = require('passport-local-mongoose');
var UserSettings          = require('../settings').User;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type      : String,
    lowercase : true
    //unique    : UserErrors.email.unique,
  }
});

// passport-local-mongoose plugin
UserSchema.plugin(passportLocalMongoose, {
  usernameField          : 'email',
  missingUsernameError   : UserSettings.errors.email.required,
  missingPasswordError   : UserSettings.errors.passwordMissing,
  userExistsError        : UserSettings.errors.email.unique,
  incorrectPasswordError : UserSettings.errors.incorrectPassword
});

// Validations
UserSchema.path('email')   .required(true, UserSettings.errors.email.required);
UserSchema.path('email').validate(validator.isEmail, UserSettings.errors.email.invalid);

var transform = function(doc, ret, options){
  return _.pick(ret, UserSettings.paths);
};

UserSchema.set('toJSON',   { transform: transform });
UserSchema.set('toObject', { transform: transform });

// Promisify passport-local-mongoose plugin statics
BB.promisifyAll(UserSchema.statics);
BB.promisifyAll(UserSchema.methods);

module.exports = mongoose.model('User', UserSchema);
