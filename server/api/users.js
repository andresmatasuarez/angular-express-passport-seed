'use strict';

const _          = require('lodash');
const Bluebird   = require('bluebird');
const express    = require('express');
const Response   = require('simple-response');
const User       = require('../model/user');
const Auth       = require('../middlewares').Auth;
const RouteUtils = require('../utils/route_utils');
const Settings   = require('../settings');

const UserErrors = Settings.User.errors;

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

router.get('/', Auth.ensureAuthenticated, normalize.queryParams, (req, res, next) => {
  User.findAsync({}, Settings.User.paths.join(' '), {
    skip  : req.query.skip,
    limit : req.query.limit,
    sort  : Settings.User.sort
  })
  .then(Response.Ok(res))
  .catch(next);
});

router.get('/total', Auth.ensureAuthenticated, (req, res, next) => {
  User.countAsync()
  .then((total) => {
    Response.Ok(res)({ total });
  })
  .catch(next);
});

router.get('/:id', Auth.ensureAuthenticated, RouteUtils.validateId({ error: Settings.User.errors.invalidId }), RouteUtils.populateById('User', 'fetchedUser', {
  fields: Settings.User.paths.join(' '),
  error: Settings.User.errors.notFound
}), (req, res) => {
  Response.Ok(res)(req.fetchedUser);
});

router.post('/', Auth.ensureAuthenticated, (req, res, next) => {
  User.registerAsync(new User({ email: req.body.email }), req.body.password)
  .then(Response.Ok(res))
  .catch(next);
});

router.put('/:id', Auth.ensureAuthenticated, RouteUtils.populateById('User', 'fetchedUser', {
  error: Settings.User.errors.notFound
}), (req, res) => {

  let editionPromise = Bluebird.resolve();
  if (req.body.newPassword) {
    if (!_.isEqual(req.body.newPassword, req.body.confirmPassword)) {
      return Response.BadRequest(res)(UserErrors.passwordsNotConfirmed);
    }

    editionPromise = editionPromise.then(() => {
      return req.fetchedUser.authenticateAsync(req.body.password);
    })
    .then((result) => {
      // isArray determines if authentication failed.
      // Check https://github.com/saintedlama/passport-local-mongoose#authenticatepassword-cb
      if (_.isArray(result)) {
        throw new Error(result[1].message);
      }

      return req.fetchedUser.setPasswordAsync(req.body.newPassword);
    })
    .then(() => {
      return req.fetchedUser.saveAsync();
    });
  }

  editionPromise.then(() => {
    return req.fetchedUser.updateAsync(req.body);
  })
  .then(Response.Ok(res))
  .catch((err) => {
    if (_.isEqual(err.message, UserErrors.incorrectPassword)) {
      Response.BadRequest(res)(err.message);
    } else {
      Response.InternalServerError(res)(err);
    }
  });
});

router.delete('/:id', Auth.ensureAuthenticated, RouteUtils.validateId({ error: Settings.User.errors.invalidId }), (req, res, next) => {
  User.findByIdAndRemoveAsync(req.params.id)
  .then(Response.Ok(res))
  .catch(next);
});

module.exports = router;
