'use strict';

require('../../server/bin/context');

const _               = require('lodash');
const request         = require('supertest');
const expect          = require('chai').expect;
const App             = require('../../server/app');
const Admin           = require('../../server/model/admin');
const AdminSeed       = require('../../seeds/admin');
const TestUtils       = require('../../tests/utils');
const SuperAgentUtils = require('./superagent_utils');

const server     = request(App.server.https);
const agent      = request.agent(App.server.https);
const agentUtils = new SuperAgentUtils(agent);

function performLogin(admin, password) {
  return server
  .post('/api/auth/login')
  .send({
    email: admin.email,
    password
  })
  .endAsync()
  .then(agentUtils.saveCookies.bind(agentUtils));
}

describe('Authentication', function() {

  // Increase default timeout to let admin seed do its work.
  const adminsToSeed = 1;
  TestUtils.seedingTimeout(this, adminsToSeed, 2000);

  let admin;
  const randomId = '507f1f77bcf86cd799439011';

  before(() => {
    return App.setup()
    .then(() => Admin.removeAsync())
    .then(() => AdminSeed.seed(adminsToSeed))
    .then(_.first)
    .then((registered) => {
      admin = registered;
    });
  });

  after(() => Admin.removeAsync());

  describe('Unauthenticated', function() {

    describe('POST /api/auth/login', function() {

      it('(missing credentials) should respond 401', function() {
        return server.post('/api/auth/login')
        .expect(401)
        .expect('Content-Type', /json/)
        .endAsync()
        .then((res) => {
          expect(res.body).not.to.be.empty;
          expect(res.body.message).to.be.equals('Missing credentials');
        });
      });

      it('(invalid credentials) should respond 401', function() {
        return server.post('/api/auth/login')
        .expect(401)
        .expect('Content-Type', /json/)
        .send({
          email    : 'fake@admin.com',
          password : 'fake_password'
        })
        .endAsync()
        .then((res) => {
          expect(res.body).not.to.be.empty;
          expect(res.body.message).to.be.equals('Incorrect email');
        });
      });

      it('(invalid password) should respond 401', function() {
        return server.post('/api/auth/login')
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
        });
      });

    });

    it('POST /api/auth/logout should respond 204', function() {
      return server.post('/api/auth/logout').expect(204).endAsync();
    });

    it('GET /api/auth/me should respond 401', function() {
      return server.get('/api/auth/me').expect(401).expect('Content-Type', /json/).endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
      });
    });

    it('GET /api/admins/ should respond 401', function() {
      return server.get('/api/admins').expect(401).expect('Content-Type', /json/).endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
      });
    });

    it('GET /api/admins/:id should respond 401', function() {
      return server.get(`/api/admins/${randomId}`).expect(401).expect('Content-Type', /json/).endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
      });
    });

    it('GET /api/admins/total should respond 401', function() {
      return server.get('/api/admins/total').expect(401).expect('Content-Type', /json/).endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
      });
    });

    it('POST /api/admins/ should respond 401', function() {
      return server.post('/api/admins/').expect(401).expect('Content-Type', /json/).endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
      });
    });

    it('PUT /api/admins/:id should respond 401', function() {
      return server.put(`/api/admins/${randomId}`).expect(401).expect('Content-Type', /json/).endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
      });
    });

    it('DELETE /api/admins/:id should respond 401', function() {
      return server.delete(`/api/admins/${randomId}`).expect(401).expect('Content-Type', /json/).endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.be.equals('No token provided.');
      });
    });

  });

  describe('Authenticated', function() {

    before(() => performLogin(admin, 'test'));

    it('GET /api/admins should respond 200', function() {
      return agentUtils.withCookies(server.get('/api/admins')).expect(200).endAsync();
    });

    it('GET /api/admins/total should respond 200', function() {
      return agentUtils.withCookies(server.get('/api/admins/total')).expect(200).endAsync();
    });

    it('GET /api/admins/:id should respond 404', function() {
      return agentUtils.withCookies(server.get(`/api/admins/${randomId}`)).expect(404).endAsync();
    });

    it('POST /api/admins/ should respond 400', function() {
      return agentUtils.withCookies(server.post('/api/admins/')).expect(400).endAsync();
    });

    it('PUT /api/admins/:id should respond 404', function() {
      return agentUtils.withCookies(server.put(`/api/admins/${randomId}`)).expect(404).endAsync();
    });

    it('DELETE /api/admins/:id should respond 404', function() {
      return agentUtils.withCookies(server.delete(`/api/admins/${randomId}`)).expect(404).endAsync();
    });

    it('DELETE /api/admins/:logged_admin_id should respond 400', function() {
      return agentUtils.withCookies(server.delete(`/api/admins/${admin._id}`)).expect(400).endAsync();
    });

  });

});
