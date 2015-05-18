'use strict'

app = angular.module 'dashboard'

INITIAL_PAGE          = 1
INITIAL_ROWS_PER_PAGE = 10

app.controller 'UsersListController', ($scope, $q, $state, $modal, ngTableParams, API) ->

  # 'delete' is a reserved word
  remove = (id) ->
    $scope.loadingTable = true
    API.users.delete(id)
    .then ->
      $scope.tableParams.reload()
      delete $scope.loadingTable

  $scope.addUser = ->
    $state.go 'users.add'

  $scope.inspect = (user) ->
    $state.go 'users.edit',
      id: user._id

  $scope.confirmDeletion = (user) ->
    modalInstance = $modal.open
      templateUrl: 'partials/_delete_user_confirm.html'
      scope: _.merge $scope.$new(true),
        username: user.email

    modalInstance.result
    .then ->
      remove(user._id)

  $scope.tableParams = new ngTableParams
    page  : INITIAL_PAGE
    count : INITIAL_ROWS_PER_PAGE
  ,
    # '$scope: $scope' line added to avoid
    # "TypeError: Cannot read property '$on' of null"
    # src: https://github.com/esvit/ng-table/issues/182
    $scope: $scope

    getData: ($defer, params) ->
      $scope.loadingTable = true

      skip = (params.page() - 1) * params.count()
      limit = params.count()

      $q.all [
        API.users.total()
        API.users.list skip, limit
      ]
      .then (results) ->
        $scope.tableParams.total results[0]
        $defer.resolve results[1]
        delete $scope.loadingTable


