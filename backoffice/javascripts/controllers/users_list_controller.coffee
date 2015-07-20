'use strict'

app = angular.module 'dashboard'

app.controller 'UsersListController', ($scope, $q, $state, API) ->

  $scope.addUser = ->
    $state.go 'users.add'

  $scope.getUserPage = (skip, limit) ->
    $q.all [
      API.users.total()
      API.users.list skip, limit
    ]

  $scope.tableOptions =
    getPage: $scope.getUserPage
    actions:
      inspect:
        method : (user) -> $state.go 'users.edit', id: user._id
        reload : false
      remove:
        method : (user) -> API.users.delete user._id
        dialog :
          templateUrl : require '../partials/_delete_user_confirm.jade'
          params      : (item) -> username: item.email
