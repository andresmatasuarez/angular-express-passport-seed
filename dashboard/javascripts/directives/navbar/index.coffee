'use strict'

_        = require 'lodash'
template = require './navbar.jade'

module.exports = ($state, $sessionStorage, AuthService) ->
  restrict : 'E'
  replace  : true
  scope    : {}
  template : template
  link     : ($scope, element, attrs) ->
    $scope._        = _
    $scope.$storage = $sessionStorage
    $scope.inspect  = -> $state.go 'users.edit', id: $sessionStorage.user._id
    $scope.logout   = -> AuthService.logout().then -> $state.go 'login'
