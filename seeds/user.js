'use strict';

var _      = require('lodash');
var bb     = require('bluebird');
var chance = require('chance').Chance();
var logger = require('../server/utils/logger');
var User   = require('../server/model/user');

var PASSWORD = 'test';

module.exports = {
  seed: function(n){
    return bb.all(_.times(n, function(i){
      return User.registerAsync({
        email: chance.email({ domain: 'test.com' })
      }, PASSWORD)
      .then(function(user){
        logger.info(user.email + ' added with password: "' + PASSWORD + '".');
        return user;
      });
    }));
  }
};
