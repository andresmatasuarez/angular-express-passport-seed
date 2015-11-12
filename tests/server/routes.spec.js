'use strict';

require('../../server/bin/context');

const request     = require('supertest');
const mongoose    = require('mongoose');
const App         = require('../../server/app');

const server  = request(App.server.http);

describe('/api API must be served over SSL', function() {

  it('GET /users should respond with 301 Redirect', function(done) {
    return server
    .get('/api/users')
    .expect(301)
    .end(done);
  });

  it('GET /users/:id should respond with 301 Redirect', function(done) {
    return server
    .get(`/api/users/${mongoose.Types.ObjectId()}`)
    .expect(301)
    .end(done);
  });

  it('GET /users/total should respond with 301 Redirect', function(done) {
    return server
    .get('/api/users/total')
    .expect(301)
    .end(done);
  });

  it('POST /users should respond with 301 Redirect', function(done) {
    return server
    .post('/api/users')
    .expect(403)
    .end(done);
  });

});

describe('/dashboard Dashboard must be served over SSL', function() {

  it('should respond with 301 Redirect', function(done) {
    return server
    .get('/dashboard')
    .expect(301)
    .end(done);
  });

});

