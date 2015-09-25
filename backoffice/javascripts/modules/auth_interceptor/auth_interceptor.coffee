'use strict'

module.exports = ($rootScope, $q, $sessionStorage) ->

  request: (config) ->
    config.headers = config.headers || {}
    config.headers.Authorization = "Bearer #{$sessionStorage.token}" if $sessionStorage.token
    config

  responseError: (rejection) ->
    if rejection.status == 401
      $rootScope.$broadcast 'auth:unauthorized'

    $q.reject rejection
