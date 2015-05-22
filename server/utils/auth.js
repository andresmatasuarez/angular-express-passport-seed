'use strict';

var _        = require('lodash');
var config   = require('config');
var jwt      = require('jsonwebtoken');
var Response = require('./response');
var User     = require('../model/user');

module.exports = {

  authenticate: function(req, res, next){

    return User.findOneAsync({ email: req.body.email })
    .then(function(user){

      if (_.isEmpty(user)){
        return Response.Unauthorized(res)('Authentication failed.');
      }

      return user.comparePassword(req.body.password)
      .then(function(matches){
        if (!matches){
          return Response.Unauthorized(res)('Authentication failed.');
        }

        var token = jwt.sign(user, config.server.token_secret, {
          expiresInMinutes: 30
        });

        return Response.Ok(res)({ message: 'Authentication successful!', token: token });

      });

    })
    .catch(Response.InternalServerError(res));

  },

  ensureAuthenticated: function(req, res, next){
    // Check header or URL parameters or POST parameters for token
    var token = req.headers.authorization || req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token){
      return Response.Unauthorized(res)('No token provided.');
    }

    token = token.replace('Bearer ', '');

    return jwt.verifyAsync(token, config.server.token_secret)
    .then(function(decoded){
      req.user = decoded;
      next();
    })
    .catch(function(err){
      return Response.Unauthorized(res)('Failed to authenticate token.');
    });

  }

};
