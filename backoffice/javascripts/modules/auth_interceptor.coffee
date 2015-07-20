'use strict'

angular   = require 'angular'
ngstorage = require 'ngstorage'

module.exports = 'auth-interceptor'

angular.module 'auth-interceptor', [ 'ngStorage' ]
.factory 'AuthInterceptor', ($rootScope, $q, $sessionStorage) ->

  request: (config) ->
    config.headers = config.headers || {}
    config.headers.Authorization = "Bearer #{$sessionStorage.token}" if $sessionStorage.token
    config

  responseError: (rejection) ->
    if rejection.status == 401
      $rootScope.$broadcast 'auth:unauthorized'

    $q.reject rejection
