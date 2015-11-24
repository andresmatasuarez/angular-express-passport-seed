'use strict';

require('../server/bin/context');

const _          = require('lodash');
const config     = require('config');
const Mongootils = require('mongootils');
const AdminSeed  = require('../seeds/admin');
const Log        = require('../server/utils/log');

new Mongootils(config.mongo.uri, config.mongo.options)
.connect()
.then(() => {
  return AdminSeed.seed(process.argv[2]);
})
.then((result) => {
  Log.info('Finished seeding. Seeded admins:');
  _(result)
  .forEach((admin) => {
    Log.info(`  Admin { _id: ${admin._id}, Email: ${admin.email} }`);
  });

  process.exit(0);
})
.catch((err) => {
  console.log(JSON.stringify(err));
  process.exit(1);
});
