'use strict';

var ME       = { _id: '123456789012345678901234', email: 'test@test.com' };
var PASSWORD = '123456';

describe('Service: API', function(){

  beforeEach(module('dashboard'));
  beforeEach(module('dashboardTemplates'));

  it('should be registered', inject(function(API){
    expect(API).not.to.be.null;
  }));

  describe('auth', function(){

    var $httpBackend, $rootScope, API;

    beforeEach(inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      $rootScope   = $injector.get('$rootScope');
      API          = $injector.get('API');

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

      var result;
      API.auth.me().then(function(r){ result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.ok;
      expect(result._id).to.be.eql(ME._id);
      expect(result.email).to.be.eql(ME.email);
    });

    it('.login should log user in', function(){
      $httpBackend.expect(
        'POST',
        '/api/auth/login',
        'email=' + ME.email.replace('@', '%40') + '&password=' + PASSWORD,
        function(headers){
          return headers['Content-Type'] === 'application/x-www-form-urlencoded; charset=UTF-8';
        }
      );

      var result;
      API.auth.login(ME.email, PASSWORD)
      .then(function(r){ result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.instanceof(Object);
      expect(result).to.be.empty;
    });

    it('.logout should log user out', function(){
      $httpBackend.expect('POST', '/api/auth/logout');

      var result;
      API.auth.logout()
      .then(function(r){ result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.undefined;
    });

  });

  describe('users', function(){

    var $httpBackend, $rootScope, API;

    beforeEach(inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      $rootScope   = $injector.get('$rootScope');
      API          = $injector.get('API');

      $httpBackend.when('GET',    '/api/auth/me')               .respond({ _id: ME._id, email: ME.email });
      $httpBackend.when('GET',    '/api/users/total')           .respond({ total: 15 });
      $httpBackend.when('GET',    '/api/users')                 .respond(_.times(100, _.identity));
      $httpBackend.when('GET',    '/api/users?skip=6')          .respond(_.times(94, _.identity));
      $httpBackend.when('GET',    '/api/users?limit=66')        .respond(_.times(66, _.identity));
      $httpBackend.when('DELETE', '/api/users/some_id')         .respond();
      $httpBackend.when('GET',    '/api/users?skip=6&limit=66') .respond(_.times(60, _.identity));
      $httpBackend.when('GET',    '/api/users?limit=66&skip=6') .respond(_.times(60, _.identity));

    }));

    afterEach(function(){
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('.total should fetch total user count', function(){
      $httpBackend.expect('GET', '/api/users/total');

      var result;
      API.users.total().then(function(r){ result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.eql(15);
    });

    it('.list should fetch user list', function(){
      $httpBackend.expect('GET', '/api/users');

      var result;
      API.users.list().then(function(r){ result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.ok;
      expect(result).to.have.length.of(100);
    });

    it('.list should fetch user list, skipping the first 6 users', function(){
      $httpBackend.expect('GET', '/api/users?skip=6');

      var result;
      API.users.list(6).then(function(r){ result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.ok;
      expect(result).to.have.length.of(94);
    });

    it('.list should fetch user list, limitting to the first 66 users', function(){
      $httpBackend.expect('GET', '/api/users?limit=66');

      var result;
      API.users.list(null, 66).then(function(r){ result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.ok;
      expect(result).to.have.length.of(66);
    });

    it('.list should fetch user list, skipping the first 6 users and limitting to the first 66 ones', function(){
      $httpBackend.expect('GET', function(url){
        return url === '/api/users?skip=6&limit=66' || url === '/api/users?limit=66&skip=6';
      });

      var result;
      API.users.list(6, 66).then(function(r){ result = r; });

      $httpBackend.flush();
      expect(result).to.be.ok;
      expect(result).to.have.length.of(60);
    });


    it('.delete should delete user by id', function(){
      $httpBackend.expect('DELETE', '/api/users/some_id');

      var result;
      API.users.delete('some_id').then(function(r){ result = r; });

      $httpBackend.flush();
      $rootScope.$apply();
      expect(result).to.be.undefined;
    });

  });

});
