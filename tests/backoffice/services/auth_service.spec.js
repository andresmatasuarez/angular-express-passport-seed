'use strict';

var USER = { _id: '123456789012345678901234', email: 'test@test.com' };
var PASSWORD = '123456';
var INVALID_PASSWORD = '666';

describe('Service: AuthService', function(){

  var helperUtils;
  var APISpy = {};

  beforeEach(angular.mock.module('dashboard'));
  beforeEach(module('dashboardTemplates'));
  beforeEach(module('helpers'));

  beforeEach(module(function($provide){
    $provide.value('API', APISpy);
  }));

  beforeEach(inject(function($q, _HelperUtils_){
    helperUtils = _HelperUtils_;
    APISpy.auth = {
      me: sinon.spy(function(){
        return $q.when(USER);
      }),
      login: sinon.spy(function(email, password){
        return password === PASSWORD ? $q.when({
          _id: USER._id,
          email: email
        }) : $q.reject();
      })
    };
  }));

  it('should be registered', inject(function(AuthService){
    expect(AuthService).not.to.be.null;
  }));

  describe('login', function(){

    var AuthService, $sessionStorage, $q;

    beforeEach(inject(function(_AuthService_, _$sessionStorage_, _$q_){
      AuthService = _AuthService_;
      $sessionStorage = _$sessionStorage_;
      $q = _$q_;
      delete $sessionStorage.user;
    }));

    it('should set logged user _id and email in SessionStorage on success', function(done){
      AuthService.login(USER.email, PASSWORD)
      .then(function(logged){
        expect(APISpy.auth.login).to.have.been.calledWithExactly(USER.email, PASSWORD);
        expect($sessionStorage.user).to.be.eql(USER);
        done();
      });

      helperUtils.digest();
    });

    it('should not set anything in SessionStorage on error', function(done){
      expect($sessionStorage.user).to.be.undefined;

      AuthService.login(USER.email, INVALID_PASSWORD)
      .catch(function(err){
        expect($sessionStorage.user).to.be.undefined;
        done();
      });

      helperUtils.digest();
    });

  });

});
