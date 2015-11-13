'use strict';

describe('"Dashboard" module', function(){

  var module;
  beforeEach(function(){
    module = angular.module('dashboard');
  });

  it('should be registered', function(){
    expect(module).not.to.be.empty;
  });

});
