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

    //unique    : AdminErrors.email.unique,
  }
});

// passport-local-mongoose plugin
schema.plugin(passportLocalMongoose, {
  usernameField          : 'email',
  missingUsernameError   : Settings.Admin.errors.email.required,
  missingPasswordError   : Settings.Admin.errors.passwordMissing,
  userExistsError        : Settings.Admin.errors.email.unique,
  incorrectPasswordError : Settings.Admin.errors.incorrectPassword
});

schema.plugin(validations);

function transform(doc, ret) {
  return _.pick(ret, Settings.Admin.paths);
}

schema.set('toJSON',   { transform });
schema.set('toObject', { transform });

// Promisify passport-local-mongoose plugin statics
Bluebird.promisifyAll(schema.statics);
Bluebird.promisifyAll(schema.methods);

module.exports = schema;
