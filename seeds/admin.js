'use strict';

const _        = require('lodash');
const Bluebird = require('bluebird');
const chance   = require('chance').Chance();
const Log      = require('../server/utils/log');
const Admin    = require('../server/model/admin');

const PASSWORD = 'test';

module.exports = {

  seed(n) {
    return Bluebird.all(_.times(n, () => {

      const admin = new Admin({
        email: chance.email({ domain: 'test.com' })
      });

      return Admin.registerAsync(admin, PASSWORD)
      .then(function(u) {
        Log.info(`${u.email} added with password: "${PASSWORD}".`);
        return u;
      });
    }));
  }

};
