'use strict';

var _        = require('lodash');
var express  = require('express');
var Response = require('../../utils/response');
var Auth     = require('../../utils/auth');

var router = express.Router();

var prepareToSendUser = function(user){
  return _.pick(user, [ '_id', 'email' ]);
};

router.get('/me', Auth.ensureAuthenticated, function(req, res){
  Response.Ok(res)(prepareToSendUser(req.user));
});

router.post('/login', function(req, res){
  Response.Ok(res)(prepareToSendUser(req.user));
});

router.post('/logout', function(req, res){
  req.logout();
  Response.NoContent(res)();
});

module.exports = router;
