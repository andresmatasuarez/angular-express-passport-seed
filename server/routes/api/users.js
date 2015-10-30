'use strict';

const _               = require('lodash');
const Bluebird        = require('bluebird');
const express         = require('express');
const Response        = require('simple-response');
const BadRequestError = require('passport-local-mongoose/lib/badrequesterror');
const User            = require('../../model/user');
const Auth            = require('../../middlewares').Auth;
const RouteUtils      = require('../../utils/route_utils');
const UserSettings    = require('../../settings').User;

const UserErrors   = UserSettings.errors;

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

router.get('/', Auth.ensureAuthenticated, normalize.queryParams, (req, res) => {
  User.findAsync({}, UserSettings.paths.join(' '), {
    skip  : req.query.skip,
    limit : req.query.limit,
    sort  : UserSettings.sort
  })
  .then(Response.Ok(res))
  .catch(Response.InternalServerError(res));
});

router.get('/total', Auth.ensureAuthenticated, (req, res) => {
  User.countAsync()
  .then((total) => {
    Response.Ok(res)({ total });
  })
  .catch(Response.InternalServerError(res));
});

router.get('/:id', Auth.ensureAuthenticated, RouteUtils.validateId({ error: UserSettings.errors.invalidId }), RouteUtils.fetchByIdAndPopulateRequest('User', 'fetchedUser', {
  fields: UserSettings.paths.join(' '),
  error: UserSettings.errors.notFound
}), (req, res) => {
  Response.Ok(res)(req.fetchedUser);
});

router.post('/', Auth.ensureAuthenticated, (req, res) => {
  User.registerAsync(new User({ email: req.body.email }), req.body.password)
  .then(Response.Ok(res))
  .catch(BadRequestError, Response.BadRequest(res))
  .catch(Response.InternalServerError(res));
});

router.put('/:id', Auth.ensureAuthenticated, RouteUtils.fetchByIdAndPopulateRequest('User', 'fetchedUser', {
  error: UserSettings.errors.notFound
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
      // isArray determines is authentication failed.
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

router.delete('/:id', Auth.ensureAuthenticated, RouteUtils.validateId({ error: UserSettings.errors.invalidId }), (req, res) => {
  User.findByIdAndRemoveAsync(req.params.id)
  .then(Response.Ok(res))
  .catch(Response.InternalServerError(res));
});

module.exports = router;
