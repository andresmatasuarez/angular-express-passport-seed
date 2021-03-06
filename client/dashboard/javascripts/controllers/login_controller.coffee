'use strict'

module.exports = ($rootScope, $scope, $state, AuthService) ->
  $scope.model = {};

  $scope.login = ->
    $scope.submitting = true;
    AuthService.login($scope.model.email, $scope.model.password)
    .then        -> $rootScope.goToNextState()
    .catch (err) -> $scope.responseErrors = $scope.cleanResponseErrors err
    .finally     -> delete $scope.submitting

  $scope.hasError = (fieldname) ->
    $scope.form[fieldname].$dirty && $scope.form[fieldname].$invalid

  $scope.error = (fieldname, error) ->
    $scope.form[fieldname].$dirty && $scope.form[fieldname].$error[error]

  $scope.submittable = ->
    !$scope.submitting && !$scope.form.$invalid
