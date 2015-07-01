'use strict';

require('../../../server/run');

var _         = require('lodash');
var request   = require('supertest');
var expect    = require('chai').expect;
var App       = require('../../../server/app');
var User      = require('../../../server/model/user');
var UserSeed  = require('../../../seeds/user');
var TestUtils = require('../../../tests/utils');

var server = request(App.server.https);

describe('/api/auth', function(){

  // Increase default timeout to let user seed do its work.
  var usersToSeed = 1;
  TestUtils.seedingTimeout(this, usersToSeed, 2000);

  var user;

  before(function(done){
    App.setup()
    .thenReturn(User.removeAsync())
    .thenReturn(UserSeed.seed(usersToSeed))
    .then(_.first)
    .then(function(registered){
      user = registered;
      done();
    })
    .catch(done);
  });

  it('/me before logging in should respond 401', function(done){
    server
    .get('/api/auth/me')
    .expect(401)
    .expect('Content-Type', /json/)
    .endAsync()
    .then(function(res){
      expect(res.body).not.to.be.empty;
      expect(res.body.message).to.be.equals('No token provided.');
      done();
    })
    .catch(done);
  });

});
