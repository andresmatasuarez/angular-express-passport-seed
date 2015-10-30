'use strict';

const _                     = require('lodash');
const Bluebird              = require('bluebird');
const mongoose              = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Settings              = require('../../settings');
const validations           = require('./validations');

const schema = new mongoose.Schema({
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

function transform(doc, ret) {
  return _.pick(ret, Settings.User.paths);
}

schema.set('toJSON',   { transform });
schema.set('toObject', { transform });

// Promisify passport-local-mongoose plugin statics
Bluebird.promisifyAll(schema.statics);
Bluebird.promisifyAll(schema.methods);

module.exports = schema;
