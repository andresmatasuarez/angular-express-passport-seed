'use strict';

const ADMIN            = { _id: '123456789012345678901234', email: 'test@test.com' };

// const PASSWORD         = '123456';
// const INVALID_PASSWORD = '666';

describe('Service: AuthService', function() {


  beforeEach(angular.mock.module('dashboard'));

  it('should be registered', inject(function(AuthService) {
    expect(AuthService).not.to.be.null;
  }));

  let API, $httpBackend, AuthService;

  beforeEach(inject(function($injector) {
    API          = $injector.get('API');
    $httpBackend = $injector.get('$httpBackend');
    AuthService  = $injector.get('AuthService');

    // Expect requests
    // Initial request to ensure admin data in client/dashboard/javascripts/app/app_run.coffee:8
    $httpBackend.expect('GET', '/api/auth/me').respond(200, { email: ADMIN.email });
    $httpBackend.flush();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('.login', function() {

    let $sessionStorage;

    beforeEach(inject(function($injector) {
      $sessionStorage = $injector.get('$sessionStorage');

      // Mock requests
      $httpBackend.when('GET', '/api/auth/me').respond(200, { email: ADMIN.email });
      $httpBackend.when('POST', '/api/auth/login').respond();

      sinon.spy(API.auth, 'me');
      sinon.spy(API.auth, 'login');
      sinon.spy(AuthService, 'ensureAdminData');

      // Clear session storage
      delete $sessionStorage.admin;
    }));

    afterEach(function() {
      API.auth.me.restore();
      API.auth.login.restore();
      AuthService.ensureAdminData.restore();
    });

    it('should call API.auth.login with username and password and AuthService.ensureAdminData after that', function() {
      AuthService.login('aUsername', 'aPassword');
      $httpBackend.flush();
      expect(API.auth.login).to.have.been.calledWithExactly('aUsername', 'aPassword');
      expect(AuthService.ensureAdminData).to.have.been.called;
    });

  });

  describe('.logout', function() {

    beforeEach(function() {
      // Mock requests
      $httpBackend.when('POST', '/api/auth/logout').respond();

      sinon.spy(API.auth, 'logout');
      sinon.spy(AuthService, 'deleteAdminData');
    });

    afterEach(function() {
      API.auth.logout.restore();
      AuthService.deleteAdminData.restore();
    });

    it('should call AuthService.deleteAdminData and API.auth.logout', function() {
      AuthService.logout();
      $httpBackend.flush();
      expect(AuthService.deleteAdminData).to.have.been.called;
      expect(API.auth.logout).to.have.been.called;
    });

  });

  describe('.deleteAdminData', function() {

    let $sessionStorage;

    beforeEach(inject(function($injector) {
      $sessionStorage = $injector.get('$sessionStorage');

      // Populate session storage
      $sessionStorage.admin = {
        email: 'house@bythecemetery.com'
      };
    }));

    it('should delete "admin" property from session storage', function() {
      AuthService.deleteAdminData();
      expect($sessionStorage.admin).to.be.undefined;
    });

  });

  describe('.fetchAdminData', function() {

    let $sessionStorage;

    beforeEach(inject(function($injector) {
      $sessionStorage = $injector.get('$sessionStorage');
      $httpBackend.when('GET', '/api/auth/me').respond(200, { email: ADMIN.email });
      sinon.spy(API.auth, 'me');
      delete $sessionStorage.admin;
    }));

    it('should set session storage\'s "admin" property with result from calling API.auth.me', function() {
      AuthService.fetchAdminData();
      $httpBackend.flush();
      expect(API.auth.me).to.have.been.called;
      expect($sessionStorage.admin).to.be.eql({ email: ADMIN.email });
    });

    afterEach(function() {
      API.auth.me.restore();
    });

  });

});
