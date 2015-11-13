'use strict';

var USER             = { _id: '123456789012345678901234', email: 'test@test.com' };
var TOKEN            = 'this_is_a_jwt_token';
var PASSWORD         = '123456';
var INVALID_PASSWORD = '666';

describe('Service: AuthService', function(){

  var APISpy = {};

  beforeEach(angular.mock.module('dashboard'));

  beforeEach(angular.mock.module(function($provide){
    $provide.value('API', APISpy);
  }));

  beforeEach(inject(function($injector){
    var $q = $injector.get('$q');

    APISpy.auth = {
      me: sinon.spy(function(){
        return $q.when(USER);
      }),
      login: sinon.spy(function(email, password){
        return password === PASSWORD ? $q.when({
          token: TOKEN,
          user: {
            _id: USER._id,
            email: email
          }
        }) : $q.reject();
      })
    };
  }));

  it('should be registered', inject(function(AuthService){
    expect(AuthService).not.to.be.null;
  }));

  describe('login', function(){

    var AuthService, $sessionStorage, $q, $rootScope, HelperUtils;

    beforeEach(inject(function($injector){
      AuthService     = $injector.get('AuthService');
      $sessionStorage = $injector.get('$sessionStorage');
      $q              = $injector.get('$q');
      $rootScope      = $injector.get('$rootScope');

      delete $sessionStorage.user;
    }));

    it('should set logged user _id and email in SessionStorage on success', function(){
      expect($sessionStorage.user).to.be.undefined;

      var result;
      AuthService.login(USER.email, PASSWORD).then(function(r){ result = r; });

      $rootScope.$apply();
      expect(APISpy.auth.login).to.have.been.calledWithExactly(USER.email, PASSWORD);
      expect($sessionStorage.token).to.be.eql(TOKEN);
    });

    it('should not set anything in SessionStorage on error', function(){
      expect($sessionStorage.user).to.be.undefined;

      var error;
      AuthService.login(USER.email, INVALID_PASSWORD).catch(function(err){ error = err; });

      $rootScope.$apply();
      expect($sessionStorage.token).to.be.undefined;
    });

  });

});
