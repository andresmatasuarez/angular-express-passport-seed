'use strict';

require('../server/run');

const _          = require('lodash');
const config     = require('config');
const Mongootils = require('mongootils');
const UserSeed   = require('../seeds/user');
const Log        = require('../server/utils/log');

new Mongootils(config.mongo.uri, config.mongo.options)
.connect()
.then(() => {
  return UserSeed.seed(process.argv[2]);
})
.then((result) => {
  Log.info('Finished seeding. Seeded users:');
  _(result)
  .forEach((user) => {
    Log.info(`  User { _id: ${user._id}, Email: ${user.email} }`);
  });

  process.exit(0);
})
.catch((err) => {
  console.log(JSON.stringify(err));
  process.exit(1);
});
