import '../../../server/bin/context';
import '../../../server/bin/promisify';

import _        from 'lodash';
import mongoose from 'mongoose';
import request  from 'supertest';
import { expect } from 'chai';

import App             from '../../../server/app';
import Admin           from '../../../server/model/admin';
import AdminSeed       from '../../../seeds/admin';
import Settings        from '../../../server/settings';
import SuperAgentUtils from '../superagent_utils';
import * as TestUtils  from '../../../tests/utils';

describe('/api/admins', function() {

  let server;
  let agentUtils;

  after(() => Admin.removeAsync());

  describe('GET', function() {
    const adminsToSeed = 10;
    TestUtils.seedingTimeout(this, adminsToSeed);

    let seededAdmins;

    before(() => App.setup());

    before(() => {
      server     = request(App.server.https);
      agentUtils = new SuperAgentUtils(request.agent(App.server.https), {
        login: {
          url: '/api/auth/login',
          usernameField: 'email'
        }
      });
    });

    before(() => Admin.removeAsync());

    before(() => {
      return AdminSeed.seed(adminsToSeed)
      .then(_.partialRight(TestUtils.prepareSeededObjects, Settings.Admin.paths, (item) => item.email))
      .then((seeded) => {
        seededAdmins = seeded;
        return agentUtils.performLogin(_.first(seeded).email, 'test');
      });
    });

    it('/ should return admin list', function() {
      return agentUtils.withCookies(server.get('/api/admins'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.be.eql(seededAdmins);
      });
    });

    it('?skip=4 should return admin list skipping the first four admins', function() {
      return agentUtils.withCookies(server.get('/api/admins?skip=4'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.be.eql(_.slice(seededAdmins, 4));
      });
    });

    it('?skip=invalid_skip_param should return admin list without skipping anything', function() {
      return agentUtils.withCookies(server.get('/api/admins?skip=invalid_skip_param'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.be.eql(seededAdmins);
      });
    });

    it('?limit=4 should return the first four admins', function() {
      return agentUtils.withCookies(server.get('/api/admins?limit=4'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.be.eql(_.slice(seededAdmins, 0, 4));
      });
    });

    it('?limit=invalid_limit_param should return all admins', function() {
      return agentUtils.withCookies(server.get('/api/admins?limit=invalid_limit_param'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.be.eql(seededAdmins);
      });
    });

    it('/:id should return admin with _id = :id', function() {
      const admin = _.first(seededAdmins);
      return agentUtils.withCookies(server.get(`/api/admins/${admin._id}`))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        TestUtils.assertObjectIds(admin._id, res.body._id);
        TestUtils.assertUnorderedArrays(_.keys(res.body), Settings.Admin.paths);
      });
    });

    it('/total should return total admin list size', function() {
      return agentUtils.withCookies(server.get('/api/admins/total'))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).to.eql({ total: seededAdmins.length });
      });
    });

    it('/:not_found_id should respond with 404', function() {
      return agentUtils.withCookies(server.get(`/api/admins/${mongoose.Types.ObjectId()}`))
      .expect(404)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.eql(Settings.Admin.errors.notFound);
      });
    });

    it('/:invalid_id should respond with 400', function() {
      return agentUtils.withCookies(server.get('/api/admins/powerfromhell'))
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.eql(Settings.Admin.errors.invalidId);
      });
    });
  });

  describe('POST', function() {
    TestUtils.seedingTimeout(this, 1, 3000);

    before(() => App.setup());

    before(() => {
      server     = request(App.server.https);
      agentUtils = new SuperAgentUtils(request.agent(App.server.https), {
        login: {
          url: '/api/auth/login',
          usernameField: 'email'
        }
      });
    });

    before(() => Admin.removeAsync());

    before(() => {
      return AdminSeed.seed(1)
      .then(_.partialRight(TestUtils.prepareSeededObjects, Settings.Admin.paths, (item) => item.email))
      .then(_.first)
      .then((seeded) => agentUtils.performLogin(seeded.email, 'test'));
    });

    it('/ should create a new admin', function() {
      return agentUtils.withCookies(server.post('/api/admins'))
      .send({
        email    : 'rudimentary@peni.com',
        password : 'rudimentarypassword'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(() => Admin.findByUsernameAsync('rudimentary@peni.com'))
      .then((admin) => {
        expect(admin).to.be.instanceof(Object);
        expect(admin.email).to.eql('rudimentary@peni.com');
      });
    });

    it('/ should fail creation of a admin with an already-existing email', function() {
      return agentUtils.withCookies(server.post('/api/admins'))
      .send({
        email: 'rudimentary@peni.com',
        password: 'rudimentarypassword'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        let error = Settings.Admin.errors.email.unique;
        error = error.replace('%s', 'email');
        error = error.replace('%s', 'rudimentary@peni.com');
        expect(res.body.message).to.be.eql(error);
      });
    });

    it('/ (no email) should fail', function() {
      return agentUtils.withCookies(server.post('/api/admins'))
      .send({
        password: 'rudimentarypassword'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        let error = Settings.Admin.errors.email.required;
        error = error.replace('%s', 'email');
        expect(res.body.message).to.be.eql(error);
      });
    });

    it('/ (no password) should fail', function() {
      return agentUtils.withCookies(server.post('/api/admins'))
      .send({
        email: 'musta@paraati.com'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body.message).to.be.eql(Settings.Admin.errors.passwordMissing);
      });
    });
  });

  describe('DELETE', function() {

    TestUtils.seedingTimeout(this, 1, 3000);
    let myself;
    let anotherAdmin;

    before(() => App.setup());

    before(() => {
      server     = request(App.server.https);
      agentUtils = new SuperAgentUtils(request.agent(App.server.https), {
        login: {
          url: '/api/auth/login',
          usernameField: 'email'
        }
      });
    });

    before(() => Admin.removeAsync());

    before(() => {
      return AdminSeed.seed(2)
      .then((seeded) => {
        myself       = _.first(seeded);
        anotherAdmin = _.last(seeded);
        return agentUtils.performLogin(myself.email, 'test');
      });
    });

    it('/ should delete admin (different from myself)', function() {
      return agentUtils.withCookies(server.delete(`/api/admins/${anotherAdmin._id}`))
      .expect(200)
      .expect('Content-Type', /json/)
      .endAsync()
      .then(() => Admin.findByIdAsync(anotherAdmin._id))
      .then((foundAdmin) => expect(foundAdmin).to.be.null);
    });

    it('/ (:previously_deleted_admin_id) should respond 404', function() {
      return agentUtils.withCookies(server.delete(`/api/admins/${anotherAdmin._id}`))
      .expect(404)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.eql(Settings.Admin.errors.notFound);
      });
    });

    it('/ (:not_found_id) should respond 404', function() {
      return agentUtils.withCookies(server.delete(`/api/admins/${mongoose.Types.ObjectId()}`))
      .expect(404)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.eql(Settings.Admin.errors.notFound);
      });
    });

    it('/ (:myself) should respond 400', function() {
      return agentUtils.withCookies(server.delete(`/api/admins/${myself._id}`))
      .expect(400)
      .expect('Content-Type', /json/)
      .endAsync()
      .then((res) => {
        expect(res.body).not.to.be.empty;
        expect(res.body.message).to.eql(Settings.Admin.errors.undeletable);
      });
    });
  });
});
