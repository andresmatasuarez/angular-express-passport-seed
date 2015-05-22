'use strict';

var Response = require('./response');

module.exports = {
  ensureAuthenticated: function(req, res, next){
    return next();
  }
};
