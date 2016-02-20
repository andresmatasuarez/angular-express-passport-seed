'use strict'

module.exports = ($rootScope, $q) ->

  responseError: (rejection) ->
    if rejection.status == -1
      $rootScope.$broadcast 'connection_refused'

    $q.reject rejection
