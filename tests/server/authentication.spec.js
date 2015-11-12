'use strict';

require('../../server/bin/context');

const _               = require('lodash');
const request         = require('supertest');
const expect          = require('chai').expect;
const App             = require('../../server/app');
const User            = require('../../server/model/user');
const UserSeed        = require('../../seeds/user');
const TestUtils       = require('../../tests/utils');
const SuperAgentUtils = require('./superagent_utils');

const server     = request(App.server.https);
const agent      = request.agent(App.server.https);
const agentUtils = new SuperAgentUtils(agent);

function performLogin(user, password) {
  return server
  .post('/api/auth/login')
  .send({
    email    : user.email,
    password
  })
  .endAsync()
  .then(agentUtils.saveJWT.bind(agentUtils));
}

describe('Authentication', function() {

  // Increase default timeout to let user seed do its work.
  const usersToSeed = 1;
  TestUtils.seedingTimeout(this, usersToSeed, 2000);

  let admin;
  const randomId = '507f1f77bcf86cd799439011';

  before(function(done) {
    App.setup()
    .then(() => {
      return User.removeAsync();
    })
    .then(() => {
      return UserSeed.seed(usersToSeed);
    })
    .then(_.first)
    .then((registered) => {
      admin = registered;
      done();
    })
    .catch(done);
  });

  after(function(done) {
    User.removeAsync()
    .then(() => {
      done();
    })
    .catch(done);
  });

  describe('Unauthenticated', function() {

    describe('POST /api/auth/login', function() {

      it('(missing credentials) should respond 401', function(done) {
        server.post('/api/auth/login')
        .expect(401)
        .expect('Content-Type', /json/)
        .endAsync()
        .then((res) => {
          expect(res.body).not.to.be.empty;
          expect(res.body.message).to.be.equals('Missing credentials');
          done();
        })
        .catch(done);
      });

      it('(invalid credentials) should respond 401', function(done) {
        server.post('/api/auth/login')
        .expect(401)
        .expect('Content-Type', /json/)
        .send({
          email    : 'fake@user.com',
          password : 'fake_password'
        })
        .endAsync()
        .then((res) => {
          expect(res.body).not.to.be.empty;
          expect(res.body.message).to.be.equals('Incorrect email');
          done();
        })
        .catch(done);
      });

      it('(invalid password) should respond 401', function(done) {
        server.post('/api/auth/login')
        .expect(401)
        .expect('Content-Type', /json/)
        .send({
          email    : admin.email,
          password : 'invalid_password'
        })
        .endAsync()
        .then((res) => {
          expect(res.body).not.to.be.empty;
          expect(res.body.message).to.be.equals('Incorrect password');
          done();
        })
        .catch(done);
      });

    });

    it('POST /api/auth/logout should respond 204', function(done) {
      server.post('/api/auth/logout').expect(204).end(done);
    });

    it('GET /api/auth/me should respond 401', function(done) {
      server.get('/api/auth/me').expect(401).expect('Content-Type', /json/).endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
        done();
      })
      .catch(done);
    });

    it('GET /api/users/ should respond 401', function(done) {
      server.get('/api/users').expect(401).expect('Content-Type', /json/).endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
        done();
      })
      .catch(done);
    });

    it('GET /api/users/:id should respond 401', function(done) {
      server.get(`/api/users/${randomId}`).expect(401).expect('Content-Type', /json/).endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
        done();
      })
      .catch(done);
    });

    it('GET /api/users/total should respond 401', function(done) {
      server.get('/api/users/total').expect(401).expect('Content-Type', /json/).endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
        done();
      })
      .catch(done);
    });

    it('POST /api/users/ should respond 401', function(done) {
      server.post('/api/users/').expect(401).expect('Content-Type', /json/).endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
        done();
      })
      .catch(done);
    });

    it('PUT /api/users/:id should respond 401', function(done) {
      server.put(`/api/users/${randomId}`).expect(401).expect('Content-Type', /json/).endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
        done();
      })
      .catch(done);
    });

    it('DELETE /api/users/:id should respond 401', function(done) {
      server.delete(`/api/users/${randomId}`).expect(401).expect('Content-Type', /json/).endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
        done();
      })
      .catch(done);
    });

  });

  describe('Authenticated', function() {

    before(function(done) {
      return performLogin(admin, 'test')
      .then(() => {
        done();
      })
      .catch(done);
    });

    after(function() {
      agentUtils.resetJWT();
    });

    it('GET /api/users should respond 200', function(done) {
      agentUtils.withJWT(server.get('/api/users')).expect(200).end(done);
    });

    it('GET /api/users/total should respond 200', function(done) {
      agentUtils.withJWT(server.get('/api/users/total')).expect(200).end(done);
    });

    it('GET /api/users/:id should respond 404', function(done) {
      agentUtils.withJWT(server.get(`/api/users/${randomId}`)).expect(404).end(done);
    });

    it('POST /api/users/ should respond 400', function(done) {
      agentUtils.withJWT(server.post('/api/users/')).expect(400).end(done);
    });

    it('PUT /api/users/:id should respond 404', function(done) {
      agentUtils.withJWT(server.put(`/api/users/${randomId}`)).expect(404).end(done);
    });

    it('DELETE /api/users/:id should respond 200', function(done) {
      agentUtils.withJWT(server.delete(`/api/users/${randomId}`)).expect(200).end(done);
    });

  });

});
