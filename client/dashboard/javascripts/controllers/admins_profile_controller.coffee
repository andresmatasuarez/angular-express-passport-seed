'use strict'

module.exports = ($scope, $state, API, admin) ->

  editing = !_.isEmpty admin
  action = if editing then _.partial(API.admins.edit, admin._id) else API.admins.create
  $scope.editing = editing

  # Initialize form model (to avoid ngIf child scopes creating their own 'model' property and thus, causing annoying bugs)
  $scope.model = {}

  if editing
    $scope.model.email = admin.email

  $scope.save = ->
    $scope.submitting = true
    action $scope.model
    .then        -> $state.go 'admins.list'
    .catch (err) -> $scope.responseErrors = $scope.cleanResponseErrors err
    .finally     -> delete $scope.submitting

  $scope.cancel = -> $scope.goBack()

  $scope.submittable = -> !$scope.submitting && $scope.form.$dirty && !$scope.form.$invalid
