'use strict';

var bb                    = require('bluebird');
var mongoose              = require('mongoose');
var validator             = require('validator');
var passportLocalMongoose = require('passport-local-mongoose');
var UserErrors            = require('../settings').user.errors;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type      : String,
    lowercase : true
  }
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField          : 'email',
  missingUsernameError   : UserErrors.email.required,
  missingPasswordError   : UserErrors.passwordMissing,
  userExistsError        : UserErrors.email.unique,
  incorrectPasswordError : UserErrors.incorrectPassword
});

// Validations
UserSchema.path('email').required(true, UserErrors.email.required);
UserSchema.path('email').validate(validator.isEmail, UserErrors.email.invalid);

var userModel = mongoose.model('User', UserSchema);

// Only because passport functions
bb.promisifyAll(userModel);
bb.promisifyAll(userModel.prototype);

module.exports = userModel;
