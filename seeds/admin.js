import _        from 'lodash';
import Bluebird from 'bluebird';
import Chance   from 'chance';
import Log      from '../server/utils/log';
import Admin    from '../server/model/admin';

const chance = new Chance();

const PASSWORD = 'test';

export default {

  seed(n) {
    return Bluebird.all(_.times(n, () => {
      const admin = new Admin({
        email: chance.email({ domain: 'test.com' })
      });

      return Admin.registerAsync(admin, PASSWORD)
      .then((u) => {
        Log.info(`${u.email} added with password: "${PASSWORD}".`);
        return u;
      });
    }));
  }

};
