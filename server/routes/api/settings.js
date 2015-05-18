'use strict';

var _        = require('lodash');
var config   = require('config');
var express  = require('express');
var Response = require('../../utils/response');
var Settings = require('../../settings');

var router = express.Router();

router.get('/', function(req, res){
  Response.Ok(res)(Settings);
});

module.exports = router;
