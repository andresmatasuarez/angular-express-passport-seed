'use strict';

var Response = require('./response');

module.exports = {
  ensureAuthenticated: function(req, res, next){
    return req.isAuthenticated() ? next() : Response.Unauthorized(res)();
  }
};
