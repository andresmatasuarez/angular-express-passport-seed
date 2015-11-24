'use strict'

module.exports = ($rootScope, $q) ->

  responseError: (rejection) ->
    if rejection.status == 401
      $rootScope.$broadcast 'auth:unauthorized'

    $q.reject rejection
