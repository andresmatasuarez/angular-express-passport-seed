'use strict';

require('../../server/bin/context');

const request     = require('supertest');
const mongoose    = require('mongoose');
const App         = require('../../server/app');

const server  = request(App.server.http);

describe('/api API must be served over SSL', function() {

  it('GET /admins should respond with 301 Redirect', function(done) {
    return server
    .get('/api/admins')
    .expect(301)
    .end(done);
  });

  it('GET /admins/:id should respond with 301 Redirect', function(done) {
    return server
    .get(`/api/admins/${mongoose.Types.ObjectId()}`)
    .expect(301)
    .end(done);
  });

  it('GET /admins/total should respond with 301 Redirect', function(done) {
    return server
    .get('/api/admins/total')
    .expect(301)
    .end(done);
  });

  it('POST /admins should respond with 301 Redirect', function(done) {
    return server
    .post('/api/admins')
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

