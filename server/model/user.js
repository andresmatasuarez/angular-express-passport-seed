'use strict';

var _          = require('lodash');
var config     = require('config');
var mongoose   = require('mongoose');
var bcrypt     = require('bcrypt');
var validator  = require('validator');
var UserErrors = require('../settings').user.errors;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type      : String,
    lowercase : true
    //unique    : UserErrors.email.unique,
  },
  password: {
    type   : String
    // incorrentPasswordError: UserErrors.incorrectPassword
  }
});

// Validations
UserSchema.path('email')   .required(true, UserErrors.email.required);
UserSchema.path('password').required(true, UserErrors.password.required);
UserSchema.path('email').validate(validator.isEmail, UserErrors.email.invalid);

UserSchema.pre('save', function(next){
  var user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')){
    return next();
  }

  // Generate a salt
  bcrypt.genSaltAsync(config.server.salt_work_factor)

  // Hash the password using our new salt
  .then(function(salt){
    user.salt = salt;
    return bcrypt.hashAsync(user.password, salt);
  })

  // Overwrite plain-text password with hashed one.
  .then(function(hash){
    user.password = hash;
  })

  // Continue flow.
  .then(next)
  .catch(next);
});

UserSchema.methods.comparePassword = function(candidatePassword){
  return bcrypt.compareAsync(candidatePassword, this.password);
};

var transform = function(doc, ret, options){
  return _.pick(ret, [ '_id' , 'email' ]);
};

UserSchema.set('toJSON',   { transform: transform });
UserSchema.set('toObject', { transform: transform });

module.exports = mongoose.model('User', UserSchema);
