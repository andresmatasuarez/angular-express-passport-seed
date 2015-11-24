'use strict';

const ME       = { _id: '123456789012345678901234', email: 'test@test.com' };
const PASSWORD = '123456';

describe('Service: API', function() {

  beforeEach(angular.mock.module('dashboard'));

  it('should be registered', inject(function(API) {
    expect(API).not.to.be.null;
  }));

  describe('auth', function() {

    let $httpBackend, $rootScope, API;

    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $rootScope   = $injector.get('$rootScope');
      API          = $injector.get('API');

      $httpBackend.when('GET' , '/api/auth/me').respond({ _id: ME._id, email: ME.email });
      $httpBackend.when('POST', '/api/auth/logout').respond();
      $httpBackend.when('POST', '/api/auth/login').respond();

    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('.me should fetch logged admin', function() {
      $httpBackend.expect('GET', '/api/auth/me');

      let result;
      API.auth.me().then(function(r) { result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.ok;
      expect(result._id).to.be.eql(ME._id);
      expect(result.email).to.be.eql(ME.email);
    });

    it('.login should log admin in', function() {
      $httpBackend.expect(
        'POST',
        '/api/auth/login',
        `email=${ME.email.replace('@', '%40')}&password=${PASSWORD}`,
        function(headers) {
          return headers['Content-Type'] === 'application/x-www-form-urlencoded; charset=UTF-8';
        }
      );

      let result;
      API.auth.login(ME.email, PASSWORD)
      .then(function(r) { result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.instanceof(Object);
      expect(result).to.be.empty;
    });

    it('.logout should log admin out', function() {
      $httpBackend.expect('POST', '/api/auth/logout');

      let result;
      API.auth.logout()
      .then(function(r) { result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.undefined;
    });

  });

  describe('admins', function() {

    let $httpBackend, $rootScope, API;

    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $rootScope   = $injector.get('$rootScope');
      API          = $injector.get('API');

      $httpBackend.when('GET',    '/api/auth/me')               .respond({ _id: ME._id, email: ME.email });
      $httpBackend.when('GET',    '/api/admins/total')           .respond({ total: 15 });
      $httpBackend.when('GET',    '/api/admins')                 .respond(_.times(100, _.identity));
      $httpBackend.when('GET',    '/api/admins?skip=6')          .respond(_.times(94, _.identity));
      $httpBackend.when('GET',    '/api/admins?limit=66')        .respond(_.times(66, _.identity));
      $httpBackend.when('DELETE', '/api/admins/some_id')         .respond();
      $httpBackend.when('GET',    '/api/admins?skip=6&limit=66') .respond(_.times(60, _.identity));
      $httpBackend.when('GET',    '/api/admins?limit=66&skip=6') .respond(_.times(60, _.identity));

    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('.total should fetch total admin count', function() {
      $httpBackend.expect('GET', '/api/admins/total');

      let result;
      API.admins.total().then(function(r) { result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.eql(15);
    });

    it('.list should fetch admin list', function() {
      $httpBackend.expect('GET', '/api/admins');

      let result;
      API.admins.list().then(function(r) { result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.ok;
      expect(result).to.have.length.of(100);
    });

    it('.list should fetch admin list, skipping the first 6 admins', function() {
      $httpBackend.expect('GET', '/api/admins?skip=6');

      let result;
      API.admins.list(6).then(function(r) { result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.ok;
      expect(result).to.have.length.of(94);
    });

    it('.list should fetch admin list, limitting to the first 66 admins', function() {
      $httpBackend.expect('GET', '/api/admins?limit=66');

      let result;
      API.admins.list(null, 66).then(function(r) { result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.ok;
      expect(result).to.have.length.of(66);
    });

    it('.list should fetch admin list, skipping the first 6 admins and limitting to the first 66 ones', function() {
      $httpBackend.expect('GET', function(url) {
        return url === '/api/admins?skip=6&limit=66' || url === '/api/admins?limit=66&skip=6';
      });

      let result;
      API.admins.list(6, 66).then(function(r) { result = r; });

      $httpBackend.flush();
      expect(result).to.be.ok;
      expect(result).to.have.length.of(60);
    });


    it('.delete should delete admin by id', function() {
      $httpBackend.expect('DELETE', '/api/admins/some_id');

      let result;
      API.admins.delete('some_id').then(function(r) { result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.undefined;
    });

  });

});
