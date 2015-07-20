'use strict';

app = angular.module 'dashboard'

app.directive 'navbar', ($state, $sessionStorage, AuthService) ->
  restrict    : 'E'
  replace     : true
  scope       : {}
  templateUrl : require '../partials/directives/_navbar.jade'
  link        : ($scope, element, attrs) ->
    $scope._ = _
    $scope.$storage = $sessionStorage

    $scope.inspect = ->
      $state.go 'users.edit',
        id: $sessionStorage.user._id

    $scope.logout = ->
      AuthService.logout()
      .then ->
        $state.go 'login'
