'use strict';

const _           = require('lodash');
const Bluebird    = require('bluebird');
const express     = require('express');
const Response    = require('simple-response');
const Admin       = require('../model/admin');
const RouteUtils  = require('../utils/route_utils');
const Settings    = require('../settings');
const Middlewares = require('../middlewares');

const router = express.Router();

router.get('/',
  Middlewares.Normalize('query.skip').as('integer', { defaultsTo: 0 }),
  Middlewares.Normalize('query.limit').as('integer', { defaultsTo: 0 }),
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

router.get('/:id', RouteUtils.validateId({ error: Settings.Admin.errors.invalidId }), RouteUtils.populateDocument({
  model      : Admin,
  populateTo : 'fetchedAdmin',
  fields     : Settings.Admin.paths.join(' '),
  error      : Settings.Admin.errors.notFound
}), (req, res) => {
  Response.Ok(res)(req.fetchedAdmin);
});

router.post('/', (req, res, next) => {
  const admin = new Admin({ email: req.body.email });
  Admin.registerAsync(admin, req.body.password)
  .then(Response.Ok(res))
  .catch(next);
});

router.put('/:id', RouteUtils.populateDocument({
  model      : Admin,
  populateTo : 'fetchedAdmin',
  error      : Settings.Admin.errors.notFound
}), (req, res) => {

  let editionPromise = Bluebird.resolve();
  if (req.body.newPassword) {
    if (!_.isEqual(req.body.newPassword, req.body.confirmPassword)) {
      return Response.BadRequest(res)(Settings.Admin.errors.passwordsNotConfirmed);
    }

    editionPromise = editionPromise.then(() => {
      return req.fetchedAdmin.authenticateAsync(req.body.password);
    })
    .then((result) => {
      // isArray determines if authentication failed.
      // Check https://github.com/saintedlama/passport-local-mongoose#authenticatepassword-cb
      if (_.isArray(result)) {
        throw new Error(result[1].message);
      }

      return req.fetchedAdmin.setPasswordAsync(req.body.newPassword);
    })
    .then(() => {
      return req.fetchedAdmin.saveAsync();
    });
  }

  editionPromise.then(() => {
    return req.fetchedAdmin.updateAsync(req.body);
  })
  .then(Response.Ok(res))
  .catch((err) => {
    if (_.isEqual(err.message, Settings.Admin.errors.incorrectPassword)) {
      Response.BadRequest(res)(err.message);
    } else {
      Response.InternalServerError(res)(err);
    }
  });
});

router.delete('/:id',
  RouteUtils.validateId({ error: Settings.Admin.errors.invalidId }),
  (req, res, next) => {
    Bluebird.try(() => {
      if (_.isEqual(req.params.id.toString(), req.auth.user._id.toString())) {
        return Response.BadRequest(res)(Settings.Admin.errors.undeletable);
      } else {
        return next();
      }
    })
    .catch(next);
  },
  (req, res, next) => {
    Admin.findByIdAndRemoveAsync(req.params.id)
    .then(Response.Ok(res))
    .catch(next);
  }
);

module.exports = router;
