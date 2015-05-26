'use strict';

var _ = require('lodash');

module.exports = function(req, res, next){
  // Check header or URL parameters or POST parameters for token
  var token = req.headers.authorization || req.body.token || req.query.token || req.headers['x-access-token'];

  if (!_.isEmpty(token)){
    token = token.replace('Bearer ', '');
  }

  req.token = token;
  next();
};
