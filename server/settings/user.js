'use strict';

module.exports = {
  paths  : [ '_id', 'email' ],
  sort   : {
    email: 'asc'
  },
  errors : {
    invalidId : 'Invalid user ID',
    notFound  : 'User not found',
    email     : {
      required : 'User "%s" cannot be empty',                   // '%s' appears to adapt to passport-local-mongoose error format which depends on util.format
      invalid  : 'User "email" is not a valid email address',
      unique   : 'User already exists with %s %s'               // '%s' appears to adapt to passport-local-mongoose error format which depends on util.format
    },
    passwordMissing       : 'User\'s password missing',
    incorrectPassword     : 'Incorrect password',
    passwordsNotConfirmed : 'Passwords not confirmed'
  }
};
