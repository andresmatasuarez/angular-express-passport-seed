'use strict'

module.exports = ($scope, $q, $state, API, confirmationModal) ->

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
        method : (admin) ->
          confirmationModal.open
            title       : 'Delete admin'
            message     : "Do you wish to delete admin #{admin.username}?"
            closeLabel  : 'Cancel'
            acceptLabel : 'Delete'
          .result
          .then -> API.admins.delete admin._id
