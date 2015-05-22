'use strict';

var _      = require('lodash');
var BB     = require('bluebird');
var chance = require('chance').Chance();
var Log    = require('../server/utils/log');
var User   = require('../server/model/user');

var PASSWORD = 'test';

module.exports = {

  seed: function(n){
    return BB.all(_.times(n, function(i){
      return new User({
        email    : chance.email({ domain: 'test.com' }),
        password : PASSWORD
      }).saveAsync()
      .then(_.first)
      .then(function(user){
        Log.info(user.email + ' added with password: "' + PASSWORD + '".');
        return user;
      });
    }));
  }

};
