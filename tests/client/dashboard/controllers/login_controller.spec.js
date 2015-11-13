'use strict';

describe('Controller: LoginController', function(){

  var scope, $q, $rootScope, $controller, AuthService;

  beforeEach(angular.mock.module('dashboard'));

  beforeEach(inject(function($injector){
    $controller = $injector.get('$controller');
    $rootScope  = $injector.get('$rootScope');
    $q          = $injector.get('$q');
    scope       = $rootScope.$new();
    AuthService = {};

    $controller('LoginController', {
      $scope      : scope,
      AuthService : AuthService
    });
  }));

  it('should initialize $scope.model to an empty object', function(){
    expect(scope.model).to.be.instanceof(Object);
    expect(scope.model).to.be.empty;
  });

  describe('$scope.login', function(){

    var login = {
      username        : 'username',
      password        : 'password',
      invalidPassword : 'invalidPassword'
    };

    it('should set update $scope.submitting before and after completion', function(done){
      sinon.stub($rootScope, 'goToNextState');

      AuthService.login = sinon.spy(function(){
        expect(!!scope.submitting).to.be.true;
        return $q.when();
      });

      scope.model.email    = login.username;
      scope.model.password = login.password;
      scope.login()
      .then(function(){
        expect(AuthService.login).to.have.been.calledOnce;
        expect(AuthService.login).to.have.been.calledWithExactly(login.username, login.password);
        expect($rootScope.goToNextState).to.have.been.calledOnce;
        expect(!!scope.submitting).to.be.false;
      })
      .then(function(){
        $rootScope.goToNextState.restore();
        done();
      });

      scope.$apply();
    });

    it('should expose errors under $scope.responseErrors on unsuccessful login', function(done){

      var NOT_AUTHORIZED = '403 Not Authorized';

      AuthService.login = sinon.spy(function(){
        expect(!!scope.submitting).to.be.true;
        return $q.reject(NOT_AUTHORIZED);
      });

      scope.model.email    = login.username;
      scope.model.password = login.invalidPassword;
      scope.login()
      .then(function(){
        expect(scope.responseErrors).to.be.eql([ NOT_AUTHORIZED ]);
        expect(!!scope.submitting).to.be.false;
      })
      .then(function(){
        done();
      });

      scope.$apply();
    });

  });


});
