'use strict';

const validator = require('validator');
const Settings = require('../../settings');

module.exports = function(schema) {

  // Validations
  schema.path('email').required(true, Settings.User.errors.email.required);
  schema.path('email').validate(validator.isEmail, Settings.User.errors.email.invalid);

};
