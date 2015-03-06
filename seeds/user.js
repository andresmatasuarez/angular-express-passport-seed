'use strict';

var _      = require('lodash');
var bb     = require('bluebird');
var chance = require('chance').Chance();
var Log    = require('../server/utils/log');
var User   = require('../server/model/user');

var PASSWORD = 'test';

module.exports = {
  seed: function(n){
    return bb.all(_.times(n, function(i){
      return User.registerAsync({
        email: chance.email({ domain: 'test.com' })
      }, PASSWORD)
      .then(function(user){
        Log.info(user.email + ' added with password: "' + PASSWORD + '".');
        return user;
      });
    }));
  }
};
