'use strict';

var ME = { _id: '123456789012345678901234', email: 'test@test.com' };
var PASSWORD = '123456';

describe('Service: API', function(){

  beforeEach(module('dashboard'));

  it('should be registered', inject(function(API){
    expect(API).not.to.be.null;
  }));

  describe('auth', function(){

    var $httpBackend, API;

    beforeEach(module('dashboard'));
    beforeEach(module('dashboardTemplates'));

    beforeEach(inject(function(_$httpBackend_, _API_){
      $httpBackend = _$httpBackend_;
      API = _API_;

      $httpBackend.when('GET' , '/api/auth/me').respond({ _id: ME._id, email: ME.email });
      $httpBackend.when('POST', '/api/auth/logout').respond();
      $httpBackend.when('POST', '/api/auth/login').respond();

    }));

    afterEach(function(){
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('.me should fetch logged user', function(){
      $httpBackend.expect('GET', '/api/auth/me');

      API.auth.me()
      .then(function(me){
        expect(me).to.be.ok;
        expect(me._id).to.be.eql(ME._id);
        expect(me.email).to.be.eql(ME.email);
      });

      $httpBackend.flush();
    });

    it('.login should log user in', function(){
      $httpBackend.expect('POST', '/api/auth/login', 'email=' + ME.email.replace('@', '%40') + '&password=' + PASSWORD, function(headers){
        return headers['Content-Type'] === 'application/x-www-form-urlencoded; charset=UTF-8';
      });

      API.auth.login(ME.email, PASSWORD)
      .then(function(result){
        expect(result).to.be.undefined;
      });

      $httpBackend.flush();
    });

    it('.logout should log user out', function(){
      $httpBackend.expect('POST', '/api/auth/logout');

      API.auth.logout()
      .then(function(result){
        expect(result).to.be.undefined;
      });

      $httpBackend.flush();
    });

  });

  describe('users', function(){

    var $httpBackend, API;

    beforeEach(module('dashboard'));
    beforeEach(module('dashboardTemplates'));

    beforeEach(inject(function(_$httpBackend_, _API_){
      $httpBackend = _$httpBackend_;
      API = _API_;

      $httpBackend.when('GET'   , '/api/auth/me')               .respond({ _id: ME._id, email: ME.email });
      $httpBackend.when('GET'   , '/api/users/total')           .respond({ total: 15 });
      $httpBackend.when('GET'   , '/api/users')                 .respond(_.times(100, _.identity));
      $httpBackend.when('GET'   , '/api/users?skip=6')          .respond(_.times(94, _.identity));
      $httpBackend.when('GET'   , '/api/users?limit=66')        .respond(_.times(66, _.identity));
      $httpBackend.when('DELETE', '/api/users/some_id')         .respond();
      $httpBackend.when('GET'   , function(url){
        return url === '/api/users?skip=6&limit=66' || url === '/api/users?limit=66&skip=6';
      }).respond(_.times(60, _.identity));

    }));

    afterEach(function(){
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('.total should fetch total user count', function(){
      $httpBackend.expect('GET', '/api/users/total');

      API.users.total()
      .then(function(result){
        expect(result).to.be.eql(15);
      });

      $httpBackend.flush();
    });

    it('.list should fetch user list', function(){
      $httpBackend.expect('GET', '/api/users');

      API.users.list()
      .then(function(result){
        expect(result).to.be.ok;
        expect(result).to.have.length.of(100);
      });

      $httpBackend.flush();
    });

    it('.list should fetch user list, skipping the first 6 users', function(){
      $httpBackend.expect('GET', '/api/users?skip=6');

      API.users.list(6)
      .then(function(result){
        expect(result).to.be.ok;
        expect(result).to.have.length.of(94);
      });

      $httpBackend.flush();
    });

    it('.list should fetch user list, limitting to the first 66 users', function(){
      $httpBackend.expect('GET', '/api/users?limit=66');

      API.users.list(null, 66)
      .then(function(result){
        expect(result).to.be.ok;
        expect(result).to.have.length.of(66);
      });

      $httpBackend.flush();
    });

    it('.list should fetch user list, skipping the first 6 users and limitting to the first 66 ones', function(){
      $httpBackend.expect('GET', function(url){
        return url === '/api/users?skip=6&limit=66' || url === '/api/users?limit=66&skip=6';
      });

      API.users.list(6, 66)
      .then(function(result){
        expect(result).to.be.ok;
        expect(result).to.have.length.of(60);
      });

      $httpBackend.flush();
    });


    it('.delete should delete user by id', function(){
      $httpBackend.expect('DELETE', '/api/users/some_id');

      API.users.delete('some_id')
      .then(function(result){
        expect(result).to.be.undefined;
      });

      $httpBackend.flush();
    });

  });

});
