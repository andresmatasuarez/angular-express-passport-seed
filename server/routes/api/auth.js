'use strict';

var express  = require('express');
var Response = require('../../utils/response');
var Auth     = require('../../middlewares').Auth;

var router = express.Router();

router.get('/me', Auth.ensureAuthenticated, function(req, res){
  Response.Ok(res)(req.session.user);
});

router.post('/login', Auth.authenticate, Auth.login);

router.post('/logout', Auth.logout);

module.exports = router;
