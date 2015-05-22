'use strict';

require('../server/run');

var _        = require('lodash');
var UserSeed = require('../seeds/user');
var Log      = require('../server/utils/log');
var DB       = require('../server/utils/db');

DB.connect()
.thenReturn(UserSeed.seed(process.argv[2]))
.then(function(result){
  Log.info('Finished seeding. Seeded users:');
  _(result)
  .forEach(function(user){
    Log.info('  User { _id: ' + user._id + ', Email: ' + user.email + ' }');
  });

  process.exit(0);
})
.catch(function(err){
  process.exit(1);
});
