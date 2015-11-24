'use strict'

templateErrorModal = require './_error_modal.jade'

module.exports = ($rootScope, $uibModal) ->
  open: (message, status, extras) ->
    $uibModal.open
      templateUrl : templateErrorModal
      size        : 'sm'
      controller  : [ '$scope', ($scope) ->
        $scope.status  = status
        $scope.message = message
        $scope.extras  = extras
      ]


