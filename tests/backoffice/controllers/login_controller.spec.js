'use strict';

var NOT_AUTHORIZED = '403 Not Authorized';

describe('Controller: LoginController', function(){

  var $scope, $q;
  var stateSpy, authServiceSpy;
  var login = {
    username        : 'username',
    password        : 'password',
    invalidPassword : 'invalidPassword'
  };

  beforeEach(module('dashboard'));
  beforeEach(module('stateMock'));

  beforeEach(inject(function(_$rootScope_, $controller, _$q_){
    $scope = _$rootScope_.$new();
    $q = _$q_;

    stateSpy = {
      go: sinon.spy()
    };

    authServiceSpy = {
      login: sinon.spy(function(){
        return $scope.model.password === 'password' ? $q.when() : $q.reject(NOT_AUTHORIZED);
      })
    };

    $controller('LoginController', {
      $scope      : $scope,
      $state      : stateSpy,
      AuthService : authServiceSpy
    });
  }));

  it('should initialize $scope.model to an empty object', function(){
    expect($scope.model).to.be.instanceof(Object);
    expect($scope.model).to.be.empty;
  });

  describe('$scope.login', function(){

    it('should set $scope.submitting to true before performing any operation', function(done){
      authServiceSpy.login = sinon.spy(function(){
        expect(!!$scope.submitting).to.be.true;
        return $q.when();
      });

      $scope.login()
      .then(function(){
        expect(!!$scope.submitting).to.be.false;
        done();
      });

      $scope.$apply();
    });

    it('should call AuthService.login method with model.email and model.password credentials', function(){
      $scope.model.email = login.username;
      $scope.model.password = login.password;

      $scope.login();
      $scope.$apply();
      expect(authServiceSpy.login).to.have.been.calledOnce;
      expect(authServiceSpy.login).to.have.been.calledWithExactly(login.username, login.password);
    });

    it('should go to "home" state on successful login', function(done){
      $scope.model.email = login.username;
      $scope.model.password = login.password;

      $scope.login()
      .then(function(){
        expect(stateSpy.go).to.have.been.calledOnce;
        expect(stateSpy.go).to.have.been.calledWithExactly('home');
        done();
      });

      $scope.$apply();
    });

    it('should expose errors under $scope.responseErrors on unsuccessful login', function(done){
      $scope.model.email = login.username;
      $scope.model.password = login.invalidPassword;

      $scope.login()
      .then(function(){
        expect($scope.responseErrors).to.be.eql([ NOT_AUTHORIZED ]);
        expect(stateSpy.go.callCount).to.be.eql(0);
        done();
      });

      $scope.$apply();
    });

  });


});
