'use strict';

const express  = require('express');
const Response = require('simple-response');
const Auth     = require('../../middlewares').Auth;

const router = express.Router();

router.get('/me', Auth.ensureAuthenticated, (req, res) => {
  Response.Ok(res)(req.session.user);
});

router.post('/login', Auth.authenticate, Auth.login);

router.post('/logout', Auth.logout);

module.exports = router;
