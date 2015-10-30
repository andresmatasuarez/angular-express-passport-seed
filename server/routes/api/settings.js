'use strict';

const express  = require('express');
const Response = require('simple-response');
const Settings = require('../../settings');

const router = express.Router();

router.get('/', (req, res) => {
  Response.Ok(res)(Settings);
});

module.exports = router;
