'use strict';

const _        = require('lodash');
const Bluebird = require('bluebird');
const chance   = require('chance').Chance();
const Log      = require('../server/utils/log');
const User     = require('../server/model/user');

const PASSWORD = 'test';

module.exports = {

  seed(n) {
    return Bluebird.all(_.times(n, () => {

      var user = new User({
        email: chance.email({ domain: 'test.com' })
      });

      return User.registerAsync(user, PASSWORD)
      .then(function(u) {
        Log.info(`${u.email} added with password: "${PASSWORD}".`);
        return u;
      });
    }));
  }

};
