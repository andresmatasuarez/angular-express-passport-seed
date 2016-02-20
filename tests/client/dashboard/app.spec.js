'use strict';

describe('"Dashboard" module', function() {

  let module;
  before(function() {
    module = angular.module('dashboard');
  });

  it('should be registered', function() {
    expect(module).not.to.be.empty;
  });

});
