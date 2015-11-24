'use strict';

describe('Controller: LoginController', function() {

  let scope, $q, $rootScope, AuthService, $httpBackend;

  beforeEach(angular.mock.module('dashboard'));

  beforeEach(inject(function($injector) {
    $rootScope   = $injector.get('$rootScope');
    $q           = $injector.get('$q');
    $httpBackend = $injector.get('$httpBackend');
    scope        = $rootScope.$new();
    AuthService  = {};

    const $controller  = $injector.get('$controller');

    // Mock initial request for ensure admin data
    $httpBackend.when('GET', '/api/auth/me').respond();
    $httpBackend.when('POST', '/api/auth/login').respond();

    $controller('LoginController', {
      $scope: scope,
      AuthService
    });
  }));

  afterEach(function() {
    $httpBackend.flush();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should initialize $scope.model to an empty object', function() {
    expect(scope.model).to.be.instanceof(Object);
    expect(scope.model).to.be.empty;
  });

  describe('$scope.login', function() {

    const login = {
      username        : 'username',
      password        : 'password',
      invalidPassword : 'invalidPassword'
    };

    it('should set update $scope.submitting before and after completion', function(done) {
      sinon.stub($rootScope, 'goToNextState');

      AuthService.login = sinon.spy(function() {
        expect(!!scope.submitting).to.be.true;
        return $q.when();
      });

      scope.model.email    = login.username;
      scope.model.password = login.password;
      scope.login()
      .then(function() {
        expect(AuthService.login).to.have.been.calledOnce;
        expect(AuthService.login).to.have.been.calledWithExactly(login.username, login.password);
        expect($rootScope.goToNextState).to.have.been.calledOnce;
        expect(!!scope.submitting).to.be.false;
      })
      .then(function() {
        $rootScope.goToNextState.restore();
        done();
      });

      scope.$apply();
    });

    it('should expose errors under $scope.responseErrors on unsuccessful login', function(done) {

      const NOT_AUTHORIZED = '403 Not Authorized';

      AuthService.login = sinon.spy(function() {
        expect(!!scope.submitting).to.be.true;
        return $q.reject(NOT_AUTHORIZED);
      });

      scope.model.email    = login.username;
      scope.model.password = login.invalidPassword;
      scope.login()
      .then(function() {
        expect(scope.responseErrors).to.be.eql([ NOT_AUTHORIZED ]);
        expect(!!scope.submitting).to.be.false;
      })
      .then(function() {
        done();
      });

      scope.$apply();
    });

  });


});
