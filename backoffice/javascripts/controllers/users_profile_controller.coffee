'use strict'

module.exports = ($scope, $state, API, user) ->

  editing = !_.isEmpty user
  action = if editing then _.partial(API.users.edit, user._id) else API.users.create
  $scope.editing = editing

  # Initialize form model (to avoid ngIf child scopes creating their own 'model' property and thus, causing annoying bugs)
  $scope.model = {}

  if editing
    $scope.model.email = user.email

  $scope.save = ->
    $scope.submitting = true
    action $scope.model
    .then        -> $state.go 'users.list'
    .catch (err) -> $scope.responseErrors = $scope.cleanResponseErrors err
    .finally     -> delete $scope.submitting

  $scope.cancel = -> $scope.goBack()

  $scope.submittable = -> !$scope.submitting && $scope.form.$dirty && !$scope.form.$invalid
