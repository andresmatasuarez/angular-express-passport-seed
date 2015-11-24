'use strict';

const _          = require('lodash');
const Bluebird   = require('bluebird');
const express    = require('express');
const Response   = require('simple-response');
const Admin      = require('../model/admin');
const RouteUtils = require('../utils/route_utils');
const Settings   = require('../settings');

const AdminErrors = Settings.Admin.errors;

const router = express.Router();

const normalize = {
  integer(value, defaultsTo) {
    const integer = parseInt(value);
    return _.isNaN(integer) ? defaultsTo : integer;
  },
  queryParams(req, res, next) {
    req.query.skip  = normalize.integer(req.query.skip, 0);
    req.query.limit = normalize.integer(req.query.limit, 0);
    next();
  }
};

router.get('/', normalize.queryParams, (req, res, next) => {
  Admin.findAsync({}, Settings.Admin.paths.join(' '), {
    skip  : req.query.skip,
    limit : req.query.limit,
    sort  : Settings.Admin.sort
  })
  .then(Response.Ok(res))
  .catch(next);
});

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
  Admin.registerAsync(new Admin({ email: req.body.email }), req.body.password)
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
      return Response.BadRequest(res)(AdminErrors.passwordsNotConfirmed);
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
    if (_.isEqual(err.message, AdminErrors.incorrectPassword)) {
      Response.BadRequest(res)(err.message);
    } else {
      Response.InternalServerError(res)(err);
    }
  });
});

router.delete('/:id', RouteUtils.validateId({ error: Settings.Admin.errors.invalidId }), (req, res, next) => {
  Admin.findByIdAndRemoveAsync(req.params.id)
  .then(Response.Ok(res))
  .catch(next);
});

module.exports = router;
