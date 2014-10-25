'use strict';

var helpers = angular.module('helpers', []);

helpers.service('HelperUtils', function($rootScope){

  this.newScope = function(){
    return $rootScope.$new();
  };

  this.digest = function(){
    return $rootScope.$digest();
  };

});
