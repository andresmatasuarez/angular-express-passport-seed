'use strict';

var _        = require('lodash');
var Bluebird = require('bluebird');
var chance   = require('chance').Chance();
var Log      = require('../server/utils/log');
var User     = require('../server/model/user');

var PASSWORD = 'test';

module.exports = {

  seed: function(n){
    return Bluebird.all(_.times(n, function(i){

      var user = new User({
        email: chance.email({ domain: 'test.com' })
      });

      return User.registerAsync(user, PASSWORD)
      .then(function(user){
        Log.info(user.email + ' added with password: "' + PASSWORD + '".');
        return user;
      });
    }));
  }

};
