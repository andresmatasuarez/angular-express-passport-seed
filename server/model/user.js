'use strict';

var mongoose   = require('mongoose');
var validator  = require('validator');
var UserErrors = require('../settings').user.errors;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type      : String,
    lowercase : true
  }
});

// Validations
UserSchema.path('email').required(true, UserErrors.email.required);
UserSchema.path('email').validate(validator.isEmail, UserErrors.email.invalid);

var userModel = mongoose.model('User', UserSchema);

module.exports = userModel;
