import '../server/bin/context';

import _          from 'lodash';
import config     from 'config';
import Mongootils from 'mongootils';
import AdminSeed  from '../seeds/admin';
import Log        from '../server/utils/log';

const adminsToSeed = process.argv[2] || 3;

new Mongootils(config.mongo.uri, config.mongo.options)
.connect()
.then(() => AdminSeed.seed(adminsToSeed))
.then((result) => {
  Log.info('Finished seeding. Seeded admins:');
  _(result)
  .forEach((admin) => {
    Log.info(`  Admin { _id: ${admin._id}, Email: ${admin.email} }`);
  })
  .value();

  process.exit(0);
})
.catch((err) => {
  console.log(JSON.stringify(err));
  process.exit(1);
});
