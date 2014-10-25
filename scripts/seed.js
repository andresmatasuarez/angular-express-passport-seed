'use strict';

require('../server/run');

var _        = require('lodash');
var logger   = require('../server/utils/logger');
var UserSeed = require('../seeds/user');
var DB       = require('../server/utils/db');

DB.connect()
.thenReturn(UserSeed.seed(process.argv[2]))
.then(function(result){
  logger.info('Finished seeding. Seeded users:');
  _(result)
  .forEach(function(user){
    logger.info('  User { _id: ' + user._id + ', Email: ' + user.email + ' }');
  });

  process.exit(0);
})
.catch(function(err){
  process.exit(1);
});
