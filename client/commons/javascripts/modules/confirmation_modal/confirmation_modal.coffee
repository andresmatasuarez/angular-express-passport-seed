'use strict'

confirmationModalTemplate = require './_confirmation_modal.jade'

module.exports = ($rootScope, $uibModal) ->
  open: (options) ->
    options = options || {}

    options.size = options.size || 'std';

    $uibModal.open
      templateUrl : confirmationModalTemplate
      size        : options.size
      controller  : [ '$scope', ($scope) ->
        $scope.title       = options.title
        $scope.message     = options.message
        $scope.closeLabel  = options.closeLabel
        $scope.acceptLabel = options.acceptLabel
      ]


