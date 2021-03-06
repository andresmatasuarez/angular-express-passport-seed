'use strict';

module.exports = {
  paths  : [ '_id', 'email' ],
  sort   : {
    email: 'asc'
  },
  errors : {
    invalidId   : 'Invalid admin ID',
    notFound    : 'Admin not found',
    undeletable : 'This Admin cannot be deleted (you are currently logged in as him/her or you are not allowed to do so)',
    email     : {
      required : 'Admin "%s" cannot be empty',                   // '%s' appears to adapt to passport-local-mongoose error format which depends on util.format
      invalid  : 'Admin "email" is not a valid email address',
      unique   : 'Admin already exists with %s %s'               // '%s' appears to adapt to passport-local-mongoose error format which depends on util.format
    },
    passwordMissing       : 'Admin\'s password missing',
    incorrectPassword     : 'Incorrect password',
    passwordsNotConfirmed : 'Passwords not confirmed'
  }
};
