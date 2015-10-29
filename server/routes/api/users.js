'use strict';

var _               = require('lodash');
var Bluebird        = require('bluebird');
var express         = require('express');
var BadRequestError = require('passport-local-mongoose/lib/badrequesterror');
var User            = require('../../model/user');
var Response        = require('../../utils/response');
var Auth            = require('../../middlewares').Auth;
var RouteUtils      = require('../../utils/route_utils');
var UserSettings    = require('../../settings').User;

var UserErrors   = UserSettings.errors;

var router = express.Router();

var normalize = {
  integer: function(value, defaultsTo){
    var integer = parseInt(value);
    return _.isNaN(integer) ? defaultsTo : integer;
  },
  queryParams: function(req, res, next){
    req.query.skip  = normalize.integer(req.query.skip, 0);
    req.query.limit = normalize.integer(req.query.limit, 0);
    next();
  }
};

router.get('/', Auth.ensureAuthenticated, normalize.queryParams, function(req, res){
  User.findAsync({}, UserSettings.paths.join(' '), {
    skip  : req.query.skip,
    limit : req.query.limit,
    sort  : UserSettings.sort
  })
  .then(Response.Ok(res))
  .catch(Response.InternalServerError(res));
});

router.get('/total', Auth.ensureAuthenticated, function(req, res){
  User.countAsync()
  .then(function(result){
    Response.Ok(res)({ total: result });
  })
  .catch(Response.InternalServerError(res));
});

router.get('/:id', Auth.ensureAuthenticated, RouteUtils.validateId({ error: UserSettings.errors.invalidId }), RouteUtils.fetchByIdAndPopulateRequest('User', 'fetchedUser', {
  fields: UserSettings.paths.join(' '),
  error: UserSettings.errors.notFound
}), function(req, res){
  Response.Ok(res)(req.fetchedUser);
});

router.post('/', Auth.ensureAuthenticated, function(req, res){
  User.registerAsync(new User({ email : req.body.email }), req.body.password)
  .then(Response.Ok(res))
  .catch(BadRequestError, Response.BadRequest(res))
  .catch(Response.InternalServerError(res));
});

router.put('/:id', Auth.ensureAuthenticated, RouteUtils.fetchByIdAndPopulateRequest('User', 'fetchedUser', {
  error: UserSettings.errors.notFound
}), function(req, res){

  var editionPromise = Bluebird.resolve();
  if (req.body.newPassword){
    if (!_.isEqual(req.body.newPassword, req.body.confirmPassword)){
      return Response.BadRequest(res)(UserErrors.passwordsNotConfirmed);
    }

    editionPromise = editionPromise.then(function(){
      return req.fetchedUser.authenticateAsync(req.body.password);
    })
    .then(function(result){
      // isArray determines is authentication failed.
      // Check https://github.com/saintedlama/passport-local-mongoose#authenticatepassword-cb
      if (_.isArray(result)){
        throw new Error(result[1].message);
      }

      return req.fetchedUser.setPasswordAsync(req.body.newPassword);
    })
    .then(function(){
      return req.fetchedUser.saveAsync();
    });
  }

  editionPromise.then(function(){
    return req.fetchedUser.updateAsync(req.body);
  })
  .then(Response.Ok(res))
  .catch(function(err){
    if (_.isEqual(err.message, UserErrors.incorrectPassword)){
      Response.BadRequest(res)(err.message);
    } else {
      Response.InternalServerError(res)(err);
    }
  });
});

router.delete('/:id', Auth.ensureAuthenticated, RouteUtils.validateId({ error: UserSettings.errors.invalidId }), function(req, res){
  User.findByIdAndRemoveAsync(req.params.id)
  .then(Response.Ok(res))
  .catch(Response.InternalServerError(res));
});

module.exports = router;
