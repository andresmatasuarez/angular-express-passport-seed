import _          from 'lodash';
import Bluebird   from 'bluebird';
import express    from 'express';
import Response   from 'simple-response';
import Admin      from '../model/admin';
import RouteUtils from '../utils/route_utils';
import Settings   from '../settings';
import { Normalize } from '../middlewares';

export default function adminsRouter() {
  const router = express.Router();

  router.get('/',
    Normalize('query.skip').as('integer', { defaultsTo: 0 }),
    Normalize('query.limit').as('integer', { defaultsTo: 0 }),
    (req, res, next) => {
      Admin.findAsync({}, Settings.Admin.paths.join(' '), {
        skip  : req.query.skip,
        limit : req.query.limit,
        sort  : Settings.Admin.sort
      })
      .then(Response.Ok(res))
      .catch(next);
    }
  );

  router.get('/total', (req, res, next) => {
    Admin.countAsync()
    .then((total) => {
      Response.Ok(res)({ total });
    })
    .catch(next);
  });

  router.get('/:id',
    RouteUtils.validateId({ error: Settings.Admin.errors.invalidId }),
    RouteUtils.populateDocument({
      model      : Admin,
      populateTo : 'fetchedAdmin',
      fields     : Settings.Admin.paths.join(' '),
      error      : Settings.Admin.errors.notFound
    }),
    (req, res) => {
      Response.Ok(res)(req.fetchedAdmin);
    }
  );

  router.post('/', (req, res, next) => {
    const admin = new Admin({ email: req.body.email });
    Admin.registerAsync(admin, req.body.password)
    .then(Response.Ok(res))
    .catch(next);
  });

  router.put('/:id',
    RouteUtils.populateDocument({
      model      : Admin,
      populateTo : 'fetchedAdmin',
      error      : Settings.Admin.errors.notFound
    }),
    (req, res) => {
      Bluebird.try(() => {
        if (!req.body.newPassword) {
          return null;
        }

        if (!_.isEqual(req.body.newPassword, req.body.confirmPassword)) {
          throw new Error('PasswordsNotConfirmed');
        }

        return req.fetchedAdmin.authenticateAsync(req.body.password)
        .then((result) => {
          // isArray determines if authentication failed.
          // Check https://github.com/saintedlama/passport-local-mongoose#authenticatepassword-cb
          if (_.isArray(result)) {
            throw new Error(result[1].message);
          }

          return req.fetchedAdmin.setPasswordAsync(req.body.newPassword);
        })
        .then(() => req.fetchedAdmin.saveAsync());
      })
      .then(() => req.fetchedAdmin.updateAsync(req.body))
      .then(Response.Ok(res))
      .catch((err) => {
        if (_.isEqual(err.message, Settings.Admin.errors.incorrectPassword)) {
          Response.BadRequest(res)(err.message);
        } else if (_.isEqual(err.message, 'PasswordsNotConfirmed')) {
          Response.BadRequest(res)(Settings.Admin.errors.passwordsNotConfirmed);
        } else {
          Response.InternalServerError(res)(err);
        }
      });
    }
  );

  router.delete('/:id',
    RouteUtils.validateId({ error: Settings.Admin.errors.invalidId }),
    (req, res, next) => {
      Bluebird.try(() => {
        if (_.isEqual(req.params.id.toString(), req.auth.user._id.toString())) {
          return Response.BadRequest(res)(Settings.Admin.errors.undeletable);
        }
        return next();
      })
      .catch(next);
    },
    RouteUtils.populateDocument({
      model      : Admin,
      populateTo : 'fetchedAdmin',
      error      : Settings.Admin.errors.notFound
    }),
    (req, res, next) => {
      Bluebird.try(() => req.fetchedAdmin.removeAsync())
      .then(Response.Ok(res))
      .catch(next);
    }
  );

  return router;
}
