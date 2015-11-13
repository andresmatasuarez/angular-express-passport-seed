'use strict';

const USER             = { _id: '123456789012345678901234', email: 'test@test.com' };
const TOKEN            = 'this_is_a_jwt_token';
const PASSWORD         = '123456';
const INVALID_PASSWORD = '666';

describe('Service: AuthService', function() {

  const APISpy = {};

  beforeEach(angular.mock.module('dashboard'));

  beforeEach(angular.mock.module(function($provide) {
    $provide.value('API', APISpy);
  }));

  beforeEach(inject(function($injector) {
    const $q = $injector.get('$q');

    APISpy.auth = {
      me: sinon.spy(function() {
        return $q.when(USER);
      }),
      login: sinon.spy(function(email, password) {
        return password === PASSWORD ? $q.when({
          token: TOKEN,
          user: {
            _id: USER._id,
            email
          }
        }) : $q.reject();
      })
    };
  }));

  it('should be registered', inject(function(AuthService) {
    expect(AuthService).not.to.be.null;
  }));

  describe('login', function() {

    let AuthService, $sessionStorage, $rootScope;

    beforeEach(inject(function($injector) {
      AuthService     = $injector.get('AuthService');
      $sessionStorage = $injector.get('$sessionStorage');
      $rootScope      = $injector.get('$rootScope');

      delete $sessionStorage.user;
    }));

    it('should set logged user _id and email in SessionStorage on success', function() {
      expect($sessionStorage.user).to.be.undefined;

      AuthService.login(USER.email, PASSWORD);

      $rootScope.$apply();
      expect(APISpy.auth.login).to.have.been.calledWithExactly(USER.email, PASSWORD);
      expect($sessionStorage.token).to.be.eql(TOKEN);
    });

    it('should not set anything in SessionStorage on error', function() {
      expect($sessionStorage.user).to.be.undefined;

      AuthService.login(USER.email, INVALID_PASSWORD);

      $rootScope.$apply();
      expect($sessionStorage.token).to.be.undefined;
    });

  });

});
