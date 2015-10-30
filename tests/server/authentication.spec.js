'use strict';

require('../../server/run');

var _               = require('lodash');
var request         = require('supertest');
var expect          = require('chai').expect;
var App             = require('../../server/app');
var User            = require('../../server/model/user');
var UserSeed        = require('../../seeds/user');
var TestUtils       = require('../../tests/utils');
var SuperAgentUtils = require('./superagent_utils');

var server     = request(App.server.https);
var agent      = request.agent(App.server.https);
var agentUtils = new SuperAgentUtils(agent);

var performLogin = function(user, password){
  return server
  .post('/api/auth/login')
  .send({
    email    : user.email,
    password : password
  })
  .endAsync()
  .then(agentUtils.saveJWT.bind(agentUtils));
};

describe('Authentication', function(){

  // Increase default timeout to let user seed do its work.
  var usersToSeed = 1;
  TestUtils.seedingTimeout(this, usersToSeed, 2000);

  var admin;
  var randomId = '507f1f77bcf86cd799439011';

  before(function(done){
    App.setup()
    .then(() => {
      return User.removeAsync();
    })
    .then(() => {
      return UserSeed.seed(usersToSeed);
    })
    .then(_.first)
    .then(function(registered){
      admin = registered;
      done();
    })
    .catch(done);
  });

  after(function(done){
    User.removeAsync()
    .then(function(){
      done();
    })
    .catch(done);
  });

  describe('Unauthenticated', function(){

    describe('POST /api/auth/login', function(){

      it('(missing credentials) should respond 401', function(done){
        server.post('/api/auth/login')
        .expect(401)
        .expect('Content-Type', /json/)
        .endAsync()
        .then(function(res){
          expect(res.body).not.to.be.empty;
          expect(res.body.message).to.be.equals('Missing credentials');
          done();
        })
        .catch(done);
      });

      it('(invalid credentials) should respond 401', function(done){
        server.post('/api/auth/login')
        .expect(401)
        .expect('Content-Type', /json/)
        .send({
          email    : 'fake@user.com',
          password : 'fake_password'
        })
        .endAsync()
        .then(function(res){
          expect(res.body).not.to.be.empty;
          expect(res.body.message).to.be.equals('Incorrect email');
          done();
        })
        .catch(done);
      });

      it('(invalid password) should respond 401', function(done){
        server.post('/api/auth/login')
        .expect(401)
        .expect('Content-Type', /json/)
        .send({
          email    : admin.email,
          password : 'invalid_password'
        })
        .endAsync()
        .then(function(res){
          expect(res.body).not.to.be.empty;
          expect(res.body.message).to.be.equals('Incorrect password');
          done();
        })
        .catch(done);
      });

    });

    it('POST /api/auth/logout should respond 204', function(done){
      server.post('/api/auth/logout').expect(204).end(done);
    });

    it('GET /api/auth/me should respond 401', function(done){
      server.get('/api/auth/me').expect(401).expect('Content-Type', /json/).endAsync()
      .then(function(res){
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
        done();
      })
      .catch(done);
    });

    it('GET /api/users/ should respond 401', function(done){
      server.get('/api/users').expect(401).expect('Content-Type', /json/).endAsync()
      .then(function(res){
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
        done();
      })
      .catch(done);
    });

    it('GET /api/users/:id should respond 401', function(done){
      server.get('/api/users/' + randomId).expect(401).expect('Content-Type', /json/).endAsync()
      .then(function(res){
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
        done();
      })
      .catch(done);
    });

    it('GET /api/users/total should respond 401', function(done){
      server.get('/api/users/total').expect(401).expect('Content-Type', /json/).endAsync()
      .then(function(res){
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
        done();
      })
      .catch(done);
    });

    it('POST /api/users/ should respond 401', function(done){
      server.post('/api/users/').expect(401).expect('Content-Type', /json/).endAsync()
      .then(function(res){
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
        done();
      })
      .catch(done);
    });

    it('PUT /api/users/:id should respond 401', function(done){
      server.put('/api/users/' + randomId).expect(401).expect('Content-Type', /json/).endAsync()
      .then(function(res){
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
        done();
      })
      .catch(done);
    });

    it('DELETE /api/users/:id should respond 401', function(done){
      server.delete('/api/users/' + randomId).expect(401).expect('Content-Type', /json/).endAsync()
      .then(function(res){
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
        done();
      })
      .catch(done);
    });

  });

  describe('Authenticated', function(){

    before(function(done){
      return performLogin(admin, 'test')
      .then(function(){
        done();
      })
      .catch(done);
    });

    after(function(){
      agentUtils.resetJWT();
    });

    it('GET /api/users should respond 200', function(done){
      agentUtils.withJWT(server.get('/api/users')).expect(200).end(done);
    });

    it('GET /api/users/total should respond 200', function(done){
      agentUtils.withJWT(server.get('/api/users/total')).expect(200).end(done);
    });

    it('GET /api/users/:id should respond 404', function(done){
      agentUtils.withJWT(server.get('/api/users/' + randomId)).expect(404).end(done);
    });

    it('POST /api/users/ should respond 400', function(done){
      agentUtils.withJWT(server.post('/api/users/')).expect(400).end(done);
    });

    it('PUT /api/users/:id should respond 404', function(done){
      agentUtils.withJWT(server.put('/api/users/' + randomId)).expect(404).end(done);
    });

    it('DELETE /api/users/:id should respond 200', function(done){
      agentUtils.withJWT(server.delete('/api/users/' + randomId)).expect(200).end(done);
    });

  });

});
