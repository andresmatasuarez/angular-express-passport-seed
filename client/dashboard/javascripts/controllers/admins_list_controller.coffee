'use strict'

deleteAdminConfirmTemplate = require '../../partials/_delete_admin_confirm.jade'

module.exports = ($scope, $q, $state, API) ->

  $scope.addAdmin = ->
    $state.go 'admins.add'

  $scope.getAdminPage = (skip, limit) ->
    $q.all [
      API.admins.total()
      API.admins.list skip, limit
    ]

  $scope.tableOptions =
    getPage: $scope.getAdminPage
    actions:
      inspect:
        method : (admin) -> $state.go 'admins.edit', id: admin._id
        reload : false
      remove:
        method : (admin) -> API.admins.delete admin._id
        dialog :
          templateUrl : deleteAdminConfirmTemplate
          params      : (item) -> username: item.email
